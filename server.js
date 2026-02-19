const express = require("express");
const app = express();
const cn = require("./db");
const PORT = 3007;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

//Hämta alla produkter
app.get("/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    res.send(data);
  });
});

app.use(express.json());

app.get("/products/:id", (req, res) => {
  cn.query(
    `SELECT * FROM products WHERE product_id = ?`,
    req.params.id,
    (err, data) => {
      res.send(data);
    },
  );
});

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

app.get("/categories/:id/products", (req, res) => {
  cn.query(
    `SELECT products.* FROM product_categories
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

app.post("/admin/products", (req, res) => {
/*   const body = {
      req.body.name,
      req.body.price,
      req.body.stock,
      req.body.description,
  } */
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
      res.send('Produkt insatt');
    },
  );
  res.send("Request nådde fram!");
});

/* Som kund vill jag kunna söka efter produkter så att jag snabbt kan hitta specifika varor */
app.get("/products", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    res.send(data);
  });
});

/* ADMIN */

app.get("/admin/orders", (req, res) => {
  cn.query("SELECT * FROM orders order by order_date desc", (err, data) => {
    res.send(data);
  });
});

/* ett program som körs som vänta och väntar på request */
app.listen(PORT);

/* GET /products?category=laptops&minPrice=5000&sort=price
GET /users?role=admin&limit=10&offset=20 */
