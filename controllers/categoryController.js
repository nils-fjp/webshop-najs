const connection = require("../config/db");

// fix later pls
exports.getAllCategories = (req, res) => {
  connection.query(`SELECT * FROM categories`, (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(data);
  });
};

exports.getAllProductsByCategory = (req, res) => {
  connection.query(
    `SELECT products.*, 
    categories.category_name 
    FROM product_categories
    JOIN products ON products.product_id = product_categories.product_id
    JOIN categories ON categories.category_id = product_categories.category_id
    WHERE categories.category_name = ?`,
    [req.params.category_name],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
};
