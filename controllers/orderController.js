const pool = require("../config/db");

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

// skapa order med customer_id och beställningen i request body:
exports.createOrder = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    await connection.beginTransaction();

    const [orderResult] = await connection.query(
      `INSERT INTO orders (
      customer_id, 
      shipping_address_id, 
      shipping_method_id, 
      order_date, 
      order_status
    ) 
    VALUES (?, ?, ?, ?, ?)`,
      [
        req.body.customer_id,
        req.body.shipping_address_id,
        req.body.shipping_method_id,
        new Date(),
        "created",
      ],
    );

    const orderId = orderResult.insertId;

    for (const item of req.body.order_items) {
      await connection.query(
        `INSERT INTO order_items (
            order_id, 
            product_id, 
            product_quantity 
          ) 
          VALUES (?, ?, ?)`,
        [orderId, item.product_id, item.product_quantity],
      );
    }

    await connection.commit();
    res.status(201).send(`Order created. orderId: ${orderId} `);
  } catch (err) {
    if (connection) await connection.rollback();
    res.status(500).send(err);
  } finally {
    if (connection) connection.release();
  }
};

/* orders.order_id,
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
