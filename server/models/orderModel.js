const cn = require("../config/db");

const orderModel = {
    findOrdersByCustomerId: async (customerId) => {
    return new Promise((resolve, reject) => {
      cn.query(
        "SELECT orders.*,products.product_name,products.listing_price, order_items.product_quantity, order_items.item_price FROM orders JOIN order_items ON orders.order_id = order_items.order_id JOIN products ON products.product_id = order_items.product_id WHERE orders.customer_id = ?",
        [customerId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

},
createForCustomer: (customerId, orderData) => {
    const { shipping_address_id, shipping_method_id, total_price, order_items } = orderData;
    return new Promise((resolve, reject) => {
      cn.beginTransaction((err) => {
        if (err) return reject(err);

        cn.query(
            `INSERT INTO orders (customer_id, shipping_address_id, shipping_method_id, total_price, order_date, order_status) VALUES (?, ?, ?, ?, ?, ?)`,
            [customerId, shipping_address_id, shipping_method_id, total_price, new Date(), "created"],
            (err, result) => {
                if (err) {
                    return cn.rollback(() => reject(err));
                }
                const orderId = result.insertId;

                // Insert items (secuencial para controlar errores facil)

                const insertItem = (index) => {
                    if (index >= order_items.length) {
                        return cn.commit((err) => {
                            if (err) return cn.rollback(() => reject(err));
                            resolve(orderId);
                        });
                    }

                    const item = order_items[index];
                    cn.query(
                        `INSERT INTO order_items (order_id, product_id, product_quantity, item_price) VALUES (?, ?, ?, ?)`,
                        [orderId, item.product_id, item.product_quantity, item.item_price],
                        (err, result) => {
                            if (err) {
                                return cn.rollback(() => reject(err));
                            }
                            insertItem(index + 1);
                        }
                    );
                };
                insertItem(0);
            }
        );
      });
    });
  },
  findAllAdmin: async () => {
    return new Promise((resolve, reject) => {
      cn.query(
        `SELECT * FROM orders ORDER BY order_date DESC`,
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
findById: (orderId) => {
    return new Promise((resolve, reject) => {
      cn.query(
        `SELECT * FROM orders WHERE order_id = ?`,
        [orderId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
  

};
module.exports = orderModel;
