const express = require("express");
const app = express();
const cn = require("./db");
const PORT = 3007;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hej");
});

//Hämta alla produkter
app.get("/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
});

// Som kund vill jag kunna söka efter produkter så att jag snabbt kan hitta specifika varor
/* 
app.get("/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).send(err);
    res.send(data);
  });
});
*/

// Hämta en specifik produkt
app.get("/products/:id", (req, res) => {
  cn.query(
    `SELECT * FROM products WHERE product_id = ?`,
    req.params.id,
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send(data);
    },
  );
});

// Hämta alla produkter i en specifik kategori
app.get("/categories/:id/products", (req, res) => {
  cn.query(
    `SELECT products.*, categories.category_name FROM product_categories
    JOIN products ON products.product_id = product_categories.product_id
    JOIN categories ON categories.category_id = product_categories.category_id
    WHERE categories.category_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send(data);
    },
  );
});

// Hämta alla ordrar för en specifik kund
app.get("/customers/:id/orders", (req, res) => {
  cn.query(
    `SELECT 
      orders.order_id,
      orders.order_date,
      orders.total_price,
      orders.order_status,
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
      res.send(data);
    },
  );
});

// Skapa en ny order för en kund
app.post("/customers/:id/orders", (req, res) => {
  const customerId = req.params.id;
  const orderItems = req.body.order_items;
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
      customerId,
      req.body.shipping_address_id,
      req.body.shipping_method_id,
      req.body.total_price,
      new Date(),
      "created",
    ],
    (err, data) => {
      if (err) return res.status(500).send(err);
      const orderId = data.insertId;

      req.body.order_items.forEach((item) => {
        cn.query(
          `
          INSERT INTO order_items 
          (order_id, product_id, product_quantity, item_price) 
          VALUES (?, ?, ?, ?)
          `,
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
      res.status(201).send(`Order lagd. InsertId: ${data.insertId}`);
    },
  );
});

/* ADMIN */
// Hämta alla ordrar som admin
app.get("/admin/orders", (req, res) => {
  cn.query("SELECT * FROM orders order by order_date desc", (err, data) => {
    res.send(data);
  });
});

// Hämta alla produkter som admin
app.get("/admin/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    res.send(data);
  });
});

// Lägg till en ny produkt i databasen
app.post("/admin/products", (req, res) => {
  cn.query(
    "INSERT INTO products (product_name, product_code, listing_price, stock_quantity, product_description) VALUES (? , ? , ? , ? , ?)",
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
  const productId = req.body.product_id;
  // Validate product_id
  if (productId === undefined) {
    return res.status(400).send("product_id required");
  }
  const numericId = Number(productId);
  if (isNaN(numericId)) {
    return res.status(400).send("product_id must be a number");
  }

  cn.query(
    `
    UPDATE products 
    SET product_name = ?, product_code = ?, listing_price = ?, stock_quantity = ?, product_description = ? 
    WHERE product_id = ?`,
    [
      req.body.product_name,
      req.body.product_code,
      req.body.listing_price,
      req.body.stock_quantity,
      req.body.product_description,
      numericId,
    ],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found");
      }
      res.send(`Product ${numericId} updated`);
    },
  );
});

// Uppdatera en befintlig produkt i databasen. Endast fälten som skickas i body uppdateras.
app.patch("/admin/products", (req, res) => {
  const productId = req.body.product_id;

  // Validate product_id
  if (productId === undefined) {
    return res.status(400).send("product_id is required");
  }
  const numericId = Number(productId);
  if (isNaN(numericId)) {
    return res.status(400).send("product_id must be a number");
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
    return res.status(400).send("No fields provided for update");
  }

  // Dynamically build the SET clause
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(numericId); // Add product_id for the WHERE clause

  // Execute the query
  cn.query(
    `UPDATE products SET ${setClause} WHERE product_id = ?`,
    values,
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send(`Product ${numericId} updated`);
    },
  );
});

app.delete("/admin/products", (req, res) => {
  const productId = req.body.product_id;
  // Validate product_id
  if (productId === undefined) {
    return res.status(400).send("product_id is required");
  }
  const numericId = Number(productId);
  if (isNaN(numericId)) {
    return res.status(400).send("product_id must be a number");
  }
  cn.query(
    `DELETE FROM products 
    WHERE product_id = ?`,
    [numericId],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found");
      }
      res.send(`Product ${numericId} deleted`);
    },
  );
});

app.get("/admin/orders/:id", (req, res) => {
  cn.query(
    `SELECT * FROM orders WHERE order_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send(data);
    },
  );
});

app.get("/admin/products/:id", (req, res) => {
  // route params get
  cn.query(
    `SELECT * FROM products 
    WHERE product_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send(data);
    },
  );
});

app.post("/admin/products/:id", (req, res) => {
  // route params post
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
      res.status(201).send(`Product ${data.insertId} inserted`);
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
        return res.status(404).send("Product not found");
      }
      res.send(`Product ${req.params.id} updated`);
    },
  );
});

// Uppdatera en specifik produkt via parameter i URL:en
app.patch("/admin/products/:id", (req, res) => {
  const productId = req.params.id;
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
    return res.status(400).send("No fields provided for update");
  }

  // Dynamically build the SET clause
  const setClause = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = Object.values(updates);
  values.push(productId); // Add product_id for the WHERE clause

  cn.query(
    `UPDATE products 
    SET ${setClause}
    WHERE product_id = ?`,
    values,
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send(`Product ${productId} updated`);
    },
  );
});

app.delete("/admin/products/:id", (req, res) => {
  cn.query(
    `DELETE FROM products 
    WHERE product_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (data.affectedRows === 0) {
        return res.status(404).send("Product not found");
      }
      res.send(`Product ${req.params.id} deleted`);
    },
  );
});

/* ett program som körs som vänta och väntar på request */
app.listen(PORT);

/* app.get("/customer/orders/:id", (req, res) => {
  cn.query(
    `SELECT * FROM orders
    JOIN order_items ON orders.order_id=order_items.order_id
    JOIN products ON products.product_id=order_items.product_id
    WHERE order_id = ?`,
    req.params.id,
    (err, data) => {
      res.send(data);
    },
  );
}); */

/* app.get("/customer/orders/:id", (res, req) => {
  cn.query(
    `SELECT * FROM orders
    JOIN order_items ON orders.orders_id=orders_items.orders_id
    JOIN products ON products.products_id=orders_items.product_id
    WHERE customer_id = ?

    `,
    req.params.id,
    (err, data) => {
      res.send(data);
    },
  );
}); */

// Följande kod kräver att precis ALLA fälten i request body finns med för att uppdatera värdet. Se fixad kod ovan.
/* app.patch("/admin/products", (req, res) => {
  const productId = req.body.product_id;

  // Check if product_id exists and is a number
  if (productId === undefined) {
    return res.status(400).send("product_id is required");
  }

  // Convert to number if it's a string, then check if it's a valid number
  const numericId = Number(productId);
  if (isNaN(numericId)) {
    return res.status(400).send("product_id must be a number");
  }

  cn.query(`
    UPDATE products 
    SET product_name = ?, 
    product_code = ?, 
    listing_price = ?, 
    stock_quantity = ?, 
    product_description = ?
    WHERE product_id = ? 
    `,
    [
      req.body.product_name,
      req.body.product_code,
      req.body.listing_price,
      req.body.stock_quantity,
      req.body.product_description,
      numericId
    ],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.send('Produkt uppdaterad');
    },
  );
  res.send("Request nådde fram!");
}); */

/* GET /products?category=laptops&minPrice=5000&sort=price
GET /users?role=admin&limit=10&offset=20 */
