const cn = require("../config/db");

const categoryModel = {
  findProductsByCategoryId: async (categoryId) => {
    return new Promise((resolve, reject) => {
      cn.query("SELECT products.*, categories.category_name FROM product_categories " +
        "JOIN products ON products.product_id = product_categories.product_id " +
        "JOIN categories ON categories.category_id = product_categories.category_id " +
        "WHERE categories.category_id = ?", 
        [categoryId],
        (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

module.exports = categoryModel;