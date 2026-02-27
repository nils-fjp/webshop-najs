const express = require("express");
const cors = require("cors");
const app = express();
const cn = require("./config/db");

const PORT = 3007;

app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.status(200).send("Hej");
});

// GET all products
app.get("/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(data);
  });
});

// Som kund vill jag kunna söka efter produkter så att jag snabbt kan hitta specifika varor
app.get("/products", (req, res) => {
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (req.query.search) {
    sql += " AND product_name LIKE ?";
    params.push(`%${req.query.search}%`);
  }
  /* if (req.query.minPrice) {
    sql += " AND listing_price >= ?";
    params.push(req.query.minPrice);
  } */

  cn.query(sql, params, (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
});

// GET a specific product
app.get("/products/:id", (req, res) => {
  cn.query(
    `SELECT * FROM products WHERE product_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
});

// GET all products in a specific category
app.get("/categories/:id/products", (req, res) => {
  cn.query(
    `SELECT products.*, categories.category_name FROM product_categories
    JOIN products ON products.product_id = product_categories.product_id
    JOIN categories ON categories.category_id = product_categories.category_id
    WHERE categories.category_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
});

// GET all orders for a specific customer
app.get("/customers/:id/orders", (req, res) => {
  cn.query(
    `SELECT 
      orders.*,
      products.product_name,
      products.listing_price,
      order_items.product_quantity,
      order_items.item_price
    FROM orders
    JOIN order_items ON orders.order_id = order_items.order_id
    JOIN products ON products.product_id = order_items.product_id
    WHERE orders.customer_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
});

// Create new order for a specific customer
app.post("/customers/:id/orders", (req, res) => {
  cn.query(
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
      req.params.id,
      req.body.shipping_address_id,
      req.body.shipping_method_id,
      req.body.total_price,
      new Date(),
      "created",
    ],
    (err, data) => {
      if (err) return res.status(500).send(err);
      req.body.order_items.forEach((item) => {
        cn.query(
          `INSERT INTO order_items (
            order_id,
            product_id,
            product_quantity,
            item_price
          ) 
          VALUES (?, ?, ?, ?)`,
          [
            data.insertId,
            item.product_id,
            item.product_quantity,
            item.item_price,
          ],
          (err, data) => {
            if (err) return res.status(500).send(err);
          },
        );
      });
      res.status(201).send(`Order created. InsertId: ${data.insertId} `);
    },
  );
});

/* ADMIN */
// GET all orders as admin
app.get("/admin/orders", (req, res) => {
  cn.query("SELECT * FROM orders order by order_date desc", (err, data) => {
    res.status(200).send(data);
  });
});

// GET all products as admin
app.get("/admin/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    res.status(200).send(data);
  });
});

// Add new product to database
app.post("/admin/products", (req, res) => {
  cn.query(
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
});

app.put("/admin/products", (req, res) => {
  // Validate product_id
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }
  cn.query(
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
});

// Uppdatera en befintlig produkt i databasen. Endast fälten som skickas i body uppdateras.
app.patch("/admin/products", (req, res) => {
  // Validate product_id
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id is required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }

  // Extract fields to update
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

  // Check if there are any updates
  if (Object.keys(updates).length === 0) {
    return res.status(400).send("No fields provided for update. ");
  }

  // Dynamically build the SET clause
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(req.body.product_id); // Add product_id for the WHERE clause

  // Execute the query
  cn.query(
    `UPDATE products SET ${setClause} WHERE product_id = ?`,
    values,
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(`Product ${req.body.product_id} updated. `);
    },
  );
});

app.delete("/admin/products", (req, res) => {
  // Validate product_id
  if (req.body.product_id === undefined) {
    return res.status(400).send("product_id is required. ");
  }
  if (isNaN(Number(req.body.product_id))) {
    return res.status(400).send("product_id must be a number. ");
  }
  cn.query(
    `DELETE FROM products WHERE product_id =` + req.body.id + "'",
    [req.body.product_id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.body.product_id} deleted. `);
    },
  );
});

app.get("/admin/orders/:id", (req, res) => {
  cn.query(
    `SELECT * FROM orders WHERE order_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
});

app.get("/admin/products/:id", (req, res) => {
  cn.query(
    `SELECT * FROM products WHERE product_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
});

app.post("/admin/products/:id", (req, res) => {
  cn.query(
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
      req.params.id,
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
});

app.put("/admin/products/:id", (req, res) => {
  cn.query(
    `UPDATE products 
    SET product_name = ?, product_code = ?, listing_price = ?, stock_quantity = ?, product_description = ? 
    WHERE product_id = ?`,
    [
      req.body.product_name,
      req.body.product_code,
      req.body.listing_price,
      req.body.stock_quantity,
      req.body.product_description,
      req.params.id,
    ],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.params.id} updated. `);
    },
  );
});

app.patch("/admin/products/:id", (req, res) => {
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

  // Check if there are any updates
  if (Object.keys(updates).length === 0) {
    return res.status(400).send("No fields provided for update. ");
  }

  // Dynamically build the SET clause
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(req.params.id); // Add product_id for the WHERE clause

  cn.query(
    `UPDATE products SET ${setClause} WHERE product_id = ?`,
    values,
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.params.id} updated. `);
    },
  );
});

app.delete("/admin/products/:id", (req, res) => {
  cn.query(
    `DELETE FROM products WHERE product_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }
      res.status(200).send(`Product ${req.params.id} deleted. `);
    },
  );
});

/* ett program som körs som vänta och väntar på request */
app.listen(PORT);
