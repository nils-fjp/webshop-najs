const pool = require("../config/db");

exports.getAllOrders = async (req, res) => {
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
      ORDER BY orders.order_date DESC`,
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getOrderById = async (req, res) => {
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
      WHERE orders.order_id = ?`,
      [req.params.order_id],
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// delete product by product_id in route params or request body
exports.deleteProduct = async (req, res) => {
  const product_id = req.params.product_id ?? req.body.product_id;
  if (product_id === undefined) {
    return res.status(400).json({ error: "product_id is required" });
  }
  if (isNaN(Number(product_id))) {
    return res.status(400).json({ error: "product_id must be a number" });
  }
  try {
    const [data] = await pool.query(
      `DELETE FROM products WHERE product_id = ?`,
      [product_id],
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: `Product ${product_id} deleted` });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

/* 
gäller för endpointen: http://localhost:3007/admin/products
app.use("/admin", adminRoutes);
router.patch("/products", adminController.patchProduct);

curl -X PATCH http://localhost:3007/admin/products \
	-H "Content-Type: application/json" \
	-d '{
			"product_id": 23,
			"stock_quantity": 69,
			"product_description": "Delvis UPDATE av testprodukt med PATCH"
		}'

*/

// UPDATE produkt via PATCH med product_id i route params eller request body
exports.patchProduct = async (req, res) => {
  const product_id = req.params.product_id ?? req.body.product_id;
  if (product_id === undefined) {
    return res.status(400).json({ error: "product_id is required" });
  }
  if (isNaN(Number(product_id))) {
    return res.status(400).json({ error: "product_id must be a valid number" });
  }
  const updates = {};
  const fields = [
    "product_name",
    "product_code",
    "listing_price",
    "stock_quantity",
    "product_description",
  ];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });
  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: "No fields provided for update" });
  }
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(product_id);
  try {
    const [data] = await pool.query(
      `UPDATE products SET ${setClause} WHERE product_id = ?`,
      values,
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: `Product ${product_id} updated` });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// update product via PUT by product_id in route params or request body
exports.putProduct = async (req, res) => {
  const product_id = req.params.product_id ?? req.body.product_id;
  if (product_id === undefined) {
    return res.status(400).json({ error: "product_id is required" });
  }
  if (isNaN(Number(product_id))) {
    return res.status(400).json({ error: "product_id must be a number" });
  }
  try {
    const [data] = await pool.query(
      `UPDATE products 
       SET product_name     = ?, 
        product_code        = ?, 
        listing_price       = ?, 
        stock_quantity      = ?, 
        product_description = ? 
      WHERE product_id = ?`,
      [
        req.body.product_name,
        req.body.product_code,
        req.body.listing_price,
        req.body.stock_quantity,
        req.body.product_description,
        product_id,
      ],
    );
    if (data.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json({ message: `Product ${product_id} updated` });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// insert product via POST
exports.postProduct = async (req, res) => {
  try {
    const [data] = await pool.query(
      `INSERT INTO products (
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description
      ) 
      VALUES (?, ?, ?, ?, ?)`,
      [
        req.body.product_name,
        req.body.product_code,
        req.body.listing_price,
        req.body.stock_quantity,
        req.body.product_description,
      ],
    );
    res.status(201).json({ message: "Product created", id: data.insertId });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
