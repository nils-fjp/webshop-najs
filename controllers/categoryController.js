const pool = require("../config/db");

// fix later pls
exports.getAllCategories = async (req, res) => {
  try {
    const [data] = await pool.query(`SELECT * FROM categories`);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getAllProductsByCategory = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT products.*, 
      categories.category_name 
      FROM product_categories
      JOIN products ON products.product_id = product_categories.product_id
      JOIN categories ON categories.category_id = product_categories.category_id
      WHERE categories.category_name = ?`,
      [req.params.category_name],
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
