const pool = require("../config/db");

exports.getAllOrders = async (req, res) => {
  try {
    const [data] = await pool.query(
      "SELECT * FROM orders order by order_date desc",
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const [data] = await pool.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [req.params.order_id],
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

/* admin products by request body */

// delete product by product_id in request body
exports.deleteProducts = async (req, res) => {
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id is required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }
  try {
    const [data] = await pool.query(
      `DELETE FROM products WHERE product_id = ?`,
      [req.body.product_id],
    );
    if (data.affectedRows === 0) {
      return res.status(404).send("Product not found. ");
    }
    res.status(200).send(`Product ${req.body.product_id} deleted. `);
  } catch (err) {
    res.status(500).send(err);
  }
};

// update product via patch by product_id in request body
exports.patchProducts = async (req, res) => {
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id is required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
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
    return res.status(400).send("No fields provided for update. ");
  }
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(req.body.product_id);
  try {
    const [data] = await pool.query(
      `UPDATE products SET ${setClause} WHERE product_id = ?`,
      values,
    );
    res.status(200).send(`Product ${req.body.product_id} updated. `);
  } catch (err) {
    res.status(500).send(err);
  }
};

// update product via put by product_id in request body
exports.putProducts = async (req, res) => {
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }
  try {
    const [data] = await pool.query(
      `UPDATE products 
      SET product_name = ?, product_code = ?, listing_price = ?, stock_quantity = ?, product_description = ? 
      WHERE product_id = ?`,
      [
        req.body.product_name,
        req.body.product_code,
        req.body.listing_price,
        req.body.stock_quantity,
        req.body.product_description,
        req.body.product_id,
      ],
    );
    if (data.affectedRows === 0) {
      return res.status(404).send("Product not found. ");
    }
    res.status(200).send(`Product ${req.body.product_id} updated. `);
  } catch (err) {
    res.status(500).send(err);
  }
};

// insert product via post by product_id in request body
exports.postProducts = async (req, res) => {
  try {
    const [data] = await pool.query(
      `INSERT INTO products (
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description
      ) 
      VALUES (? , ? , ? , ? , ?)`,
      [
        req.body.product_name,
        req.body.product_code,
        req.body.listing_price,
        req.body.stock_quantity,
        req.body.product_description,
      ],
    );
    res.status(201).send(`Product inserted. InsertId: ${data.insertId}`);
  } catch (err) {
    res.status(500).send(err);
  }
};

/* admin products by route params */

// delete product by product_id in route params
exports.deleteProductById = async (req, res) => {
  try {
    const [data] = await pool.query(
      `DELETE FROM products WHERE product_id = ?`,
      [req.params.product_id],
    );
    if (data.affectedRows === 0) {
      return res.status(404).send("Product not found. ");
    }
    res.status(200).send(`Product ${req.params.product_id} deleted. `);
  } catch (err) {
    res.status(500).send(err);
  }
};
// update product via patch by product_id in route params
exports.patchProductById = async (req, res) => {
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
    return res.status(400).send("No fields provided for update. ");
  }
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(req.params.product_id);
  try {
    const [data] = await pool.query(
      `UPDATE products SET ${setClause} WHERE product_id = ?`,
      values,
    );
    if (data.affectedRows === 0) {
      return res.status(404).send("Product not found. ");
    }
    res.status(200).send(`Product ${req.params.product_id} updated. `);
  } catch (err) {
    res.status(500).send(err);
  }
};

// insert product via post by product_id in route params
exports.postProductById = async (req, res) => {
  try {
    const [data] = await pool.query(
      `INSERT INTO products (
        product_id,
        product_name, 
        product_code, 
        listing_price, 
        stock_quantity, 
        product_description
      ) 
      VALUES (? , ? , ? , ? , ?, ?)`,
      [
        req.params.product_id,
        req.body.product_name,
        req.body.product_code,
        req.body.listing_price,
        req.body.stock_quantity,
        req.body.product_description,
      ],
    );
    res.status(201).send(`Product inserted. insertId: ${data.insertId} `);
  } catch (err) {
    res.status(500).send(err);
  }
};
// update product via put by product_id in route params
exports.putProductById = async (req, res) => {
  try {
    const [data] = await pool.query(
      `UPDATE products 
      SET product_name = ?, product_code = ?, listing_price = ?, stock_quantity = ?, product_description = ? 
      WHERE product_id = ?`,
      [
        req.body.product_name,
        req.body.product_code,
        req.body.listing_price,
        req.body.stock_quantity,
        req.body.product_description,
        req.params.product_id,
      ],
    );
    if (data.affectedRows === 0) {
      return res.status(404).send("Product not found. ");
    }
    res.status(200).send(`Product ${req.params.product_id} updated. `);
  } catch (err) {
    res.status(500).send(err);
  }
};
