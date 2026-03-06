const pool = require("../config/db");

/*
gäller för endpointen: http://localhost:3007/orders 
app.use("/orders", orderRoutes);
router.post("/", orderController.createOrder);

skicka en POST request med body:

curl -X POST http://localhost:3007/orders \
	-H "Content-Type: application/json" \
	-d '{
			"customer_id":1,
			"shipping_address_id": 1,
			"shipping_method_id": 2,
			"order_items": [
				{
					"product_id": 1,
					"product_quantity": 2
				},
				{
					"product_id": 2,
					"product_quantity": 1
				}
			]
		}'
*/

// skapa order genom customer_id och beställningsinfo i request body
exports.createOrder = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // kopiera request body till manipulerbar variabel för validering och lagring innan ordern skapas
    const orderBody = req.body;

    console.log("initial orderBody variable: ", orderBody); // debug

    // initialisera saknade värden i orderBody och tilldela nya
    orderBody.total_price = 0;
    orderBody.order_date = new Date();
    orderBody.order_status = "created";

    console.log("orderBody variable after initialization: ", orderBody); // debug

    // hämta angivna kunddata för adressvalidering
    const [customerData] = await connection.query(
      `SELECT 
      customers.customer_id,
      customer_addresses.address_id,
      customer_addresses.address_type
      FROM customers
      JOIN customer_addresses ON customers.customer_id = customer_addresses.customer_id
      WHERE customers.customer_id = ?
      AND customer_addresses.address_id = ?
      AND customer_addresses.address_type = 'shipping'`,
      [orderBody.customer_id, orderBody.shipping_address_id],
    );

    if (customerData[0].length === 0) {
      throw new Error("Invalid customer_id or shipping_address_id. ");
    }

    console.log("customerData variable: ", customerData); // debug
    let selectLoopCounter = 0; // debug

    // hämta lagersaldo, validera, och beräkna pris på varje orderrad i beställningen
    for (const item of orderBody.order_items) {
      const [productData] = await connection.query(
        `SELECT 
        products.product_name,
        products.listing_price,
        products.stock_quantity
        FROM products
        WHERE products.product_id = ?`,
        [item.product_id],
      );

      if (productData.length === 0) {
        throw new Error(`product_id ${item.product_id} not found. `);
      }
      if (productData[0].stock_quantity < item.product_quantity) {
        throw new Error(
          `Insufficient stock for product_id ${item.product_id}. `,
        );
      }
      // beräkna (styck- och) totalpris för order(rade)n
      item.item_price = productData[0].listing_price;
      orderBody.total_price += item.item_price * item.product_quantity;

      selectLoopCounter++; // debug
      console.log(
        `Processing item ${selectLoopCounter}: `,
        item,
        "productData: ",
        productData,
      ); // debug
    }

    // skapa order med validerad data ur orderBody-objektet
    const [orderResult] = await connection.query(
      `INSERT INTO orders (
      customer_id, 
      shipping_address_id, 
      shipping_method_id, 
      total_price,
      order_date, 
      order_status
    ) 
    VALUES (?, ?, ?, ?, ?, ?)`,
      [
        orderBody.customer_id,
        orderBody.shipping_address_id,
        orderBody.shipping_method_id,
        orderBody.total_price,
        orderBody.order_date,
        orderBody.order_status,
      ],
    );

    console.log("orderResult: ", orderResult); // debug

    // fånga orderns primärnyckelvärde som nästa stegs främmande nyckel pekar mot
    orderBody.order_id = orderResult.insertId;

    console.log("orderBody variable before inserting order items: ", orderBody); // debug
    let insertLoopCounter = 0; // debug
    let updateLoopCounter = 0; // debug

    // skapa en orderrad för varje produkt och bind samman med det fångade värdet
    for (const item of orderBody.order_items) {
      await connection.query(
        `INSERT INTO order_items (
            order_id, 
            product_id, 
            product_quantity,
            item_price
          ) 
          VALUES (?, ?, ?, ?)`,
        [
          orderBody.order_id,
          item.product_id,
          item.product_quantity,
          item.item_price,
        ],
      );

      insertLoopCounter++; // debug
      console.log(`Inserted order item ${insertLoopCounter}: `, item); // debug

      // uppdatera lagersaldo genom att subtrahera antalet produkter i orderraden
      await connection.query(
        `UPDATE products 
        SET stock_quantity = stock_quantity - ? 
        WHERE product_id = ?`,
        [item.product_quantity, item.product_id],
      );

      updateLoopCounter++; // debug
      console.log(
        `Updated stock for product ${item.product_id}, update count: ${updateLoopCounter}`,
      ); // debug
    }

    await connection.commit();
    res.status(201).send(`Order created with order_id: ${orderBody.order_id} `);
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).send(err);
  } finally {
    if (connection) connection.release();
  }
};

/*
## example structure of orderBody variable in createOrder function:

orderBody = {
  order_id: 21,
  customer_id: 1,                     // required in request body 
  shipping_address_id: 1,             // required in request body
  shipping_method_id: 2,              // required in request body
  total_price: 1197.00,
  order_date: "2026-03-05T18:03:25Z",
  order_status: "created",
  order_items: [
    {
      order_item_id: 21,
      order_id: 21,
      product_id: 1,                  // required in request body
      product_quantity: 2,            // required in request body
      item_price: 199.00
    },
    {
      order_item_id: 22,
      order_id: 21,
      product_id: 2,                  // required in request body
      product_quantity: 1,            // required in request body
      item_price: 799.00
    }
  ]
}
*/

// get all orders by customer_id in route params
exports.getOrdersByCustomerId = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT 
        orders.order_id,
        orders.total_price,
        orders.order_date,
        orders.order_status,
        
        customers.customer_id,
        customers.username,
        customers.email,
        customers.first_name,
        customers.last_name,
        
        order_items.product_quantity,
        order_items.item_price,

        products.product_name,

        customer_addresses.address,
        customer_addresses.city,
        customer_addresses.state_or_province,
        customer_addresses.postal_code,
        customer_addresses.country,

        shipping_methods.method_name

      FROM orders
      JOIN customers ON customers.customer_id = orders.customer_id
      JOIN order_items ON orders.order_id = order_items.order_id
      JOIN products ON products.product_id = order_items.product_id
      JOIN customer_addresses ON orders.shipping_address_id = customer_addresses.address_id
      JOIN shipping_methods ON orders.shipping_method_id = shipping_methods.shipping_methods_id
      WHERE customers.customer_id = ?`,
      [req.params.customer_id],
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

/*
## relevant database tables for /orders endpoint:

orders.order_id,
orders.customer_id,
orders.shipping_address_id,
orders.shipping_method_id,
orders.total_price,
orders.order_date,
orders.order_status,

customers.customer_id,
customers.username,
customers.email,
customers.first_name,
customers.last_name,
customers.created,

customer_addresses.address_id,
customer_addresses.customer_id,
customer_addresses.address,
customer_addresses.postal_code,
customer_addresses.country,
customer_addresses.state_or_province,
customer_addresses.city,
customer_addresses.address_type,
customer_addresses.care_of,

order_items.order_item_id,
order_items.order_id,
order_items.product_id,
order_items.product_quantity,
order_items.item_price,

products.product_id,
products.product_name,
products.product_code,
products.listing_price,
products.stock_quantity,
products.product_description,

shipping_methods.shipping_methods_id,
shipping_methods.method_name,
*/
