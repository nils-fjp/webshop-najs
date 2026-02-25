const cn = require("../config/db");
const { findAllAdmin } = require("./orderModel");

const productModel = {
  findAll: async () => {
    return new Promise((resolve, reject) => {
      cn.query("SELECT * FROM products", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      cn.query(
        "SELECT * FROM products WHERE product_id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
  findAllAdmin: async () => {
    return new Promise((resolve, reject) => {
      cn.query( `SELECT orders ORDER BY order_date DESC`, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
/*    createAdmin: (product) => {
 */
}; 

module.exports = productModel;