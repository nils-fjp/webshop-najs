const connection = require("../config/db");

exports.getAllOrders = (req, res) => {
  connection.query(
    /* orders.order_id,
      orders.customer_id,
      orders.shipping_address_id,
      orders.shipping_method_id,
      orders.total_price,
      orders.order_date,
      orders.order_status,

      customers.customer_id,
      customers.username,

      order_items.order_item_id,
      order_items.order_id,
      order_items.product_id,
      order_items.product_quantity,
      order_items.item_price,

      products.product_id,
      products.product_name,
      products.listing_price,
 */

    `SELECT 
      orders.total_price,
      orders.order_date,
      orders.order_status,
      
      products.product_name,
      order_items.product_quantity,
      order_items.item_price,
      customers.username

    FROM orders
    JOIN customers ON customers.customer_id = orders.customer_id
    JOIN order_items ON orders.order_id = order_items.order_id
    JOIN products ON products.product_id = order_items.product_id
    WHERE customers.username = ?`,
    [req.params.username],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
};

exports.getOrderById = (req, res) => {
  connection.query(
    `SELECT 
      orders.*,
      products.product_name,
      products.listing_price,
      order_items.product_quantity,
      order_items.item_price,
      customers.username

    FROM orders
    JOIN customers ON customers.customer_id = orders.customer_id
    JOIN order_items ON orders.order_id = order_items.order_id
    JOIN products ON products.product_id = order_items.product_id
    WHERE customers.username = ? 
    AND orders.order_id = ?`,
    [req.params.username, req.params.order_id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
};
