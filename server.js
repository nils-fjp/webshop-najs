const express = require("express");
const app = express();
const cn = require("./db");
const PORT = 3007;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  cn.query("SELECT * FROM filmer", (err, data) => {
    res.send(data);
  });
});

app.use(express.json());

app.get("/hello", (req, res) => {
  cn.query("SELECT * FROM products", (err, data) => {
    res.send(data);
  });
});

app.get("/customer/orders/:id", (res, req) => {
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
});

app.post("/admin/create-products", (req, res) => {
  cn.query(
    "INSERT INTO products (product_id, product_name, product_code, listing_price, stock_quantity, product_description) VALUES (? , ? , ? , ? , ?);",
    [req.body.name, req.body.price, req.body.stock, req.body.categories_id],
  );

  res.send("klart!");
});

/* ett program som körs som vänta och väntar på request */
app.listen(PORT);
