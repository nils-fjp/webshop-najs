const cn = require("../config/db");
const { createForCustomer } = require("../controllers/orderController");
const { findAll } = require("./productModel");

const orderModel = {
    findOrdersByCustomerId: async (customerId) => {
    return new Promise((resolve, reject) => {
      cn.query(
        "SELECT orders.*,products.product_name,products.listing_price,order_items.product_quantity,order_items.item_priceFROM ordersJOIN order_items ON orders.order_id = order_items.order_idJOIN products ON products.product_id = order_items.product_idWHERE orders.customer_id = ?",
        [customerId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });

},
createForCustomer: (customerId, orderData) => {
    const { shippingAddress_id, shippingMethod_id, totalPrice, order_items } = orderData;
    return new Promise((resolve, reject) => {
      cn.beginTransaction((err) => {
        if (err) return reject(err);

        cn.query(
            `INSERT INTO orders (customer_id, shippingAddress_id, shippingMethod_id, total_price, order_date, order_status) VALUES (?, ?, ?, ?, ?, ?)`,
            [customerId, shippingAddress_id, shippingMethod_id, totalPrice, new Date(), "created"],
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
  
};
module.exports = orderModel;