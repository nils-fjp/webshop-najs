const connection = require("../config/db");

exports.getAllOrders = (req, res) => {
  connection.query(
    "SELECT * FROM orders order by order_date desc",
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
};

exports.getOrderById = (req, res) => {
  connection.query(
    "SELECT * FROM orders WHERE order_id = ?",
    [req.params.order_id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
};

/* admin products by request body */

// delete product by product_id in request body
exports.deleteProducts = (req, res) => {
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id is required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }
  connection.query(
    `DELETE FROM products WHERE product_id = ?`,
    [req.body.product_id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.body.product_id} deleted. `);
    },
  );
};

// update product via patch by product_id in request body
exports.patchProducts = (req, res) => {
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
  connection.query(
    `UPDATE products SET ${setClause} WHERE product_id = ?`,
    values,
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(`Product ${req.body.product_id} updated. `);
    },
  );
};

// update product via put by product_id in request body
exports.putProducts = (req, res) => {
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }
  connection.query(
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
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.body.product_id} updated. `);
    },
  );
};

// insert product via post by product_id in request body
exports.postProducts = (req, res) => {
  connection.query(
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
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(201).send(`Product inserted. InsertId: ${data.insertId}`);
    },
  );
};

/* admin products by route params */

// delete product by product_id in route params
exports.deleteProductById = (req, res) => {
  connection.query(
    `DELETE FROM products WHERE product_id = ?`,
    [req.params.product_id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.params.product_id} deleted. `);
    },
  );
};
// update product via patch by product_id in route params
exports.patchProductById = (req, res) => {
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
  connection.query(
    `UPDATE products SET ${setClause} WHERE product_id = ?`,
    values,
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.params.product_id} updated. `);
    },
  );
};

// insert product via post by product_id in route params
exports.postProductById = (req, res) => {
  connection.query(
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
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(201).send(`Product inserted. insertId: ${data.insertId} `);
    },
  );
};
// update product via put by product_id in route params
exports.putProductById = (req, res) => {
  connection.query(
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
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.params.product_id} updated. `);
    },
  );
};
