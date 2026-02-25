const cn = require("../config/db");

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
};

module.exports = productModel;