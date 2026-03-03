const pool = require("../config/db");

exports.getAllCategories = async (req, res) => {
  let sql = "SELECT * FROM categories WHERE 1=1";
  const params = [];

  if (req.query.search) {
    sql += " AND category_name LIKE ?";
    params.push(`%${req.query.search}%`);
  }

  try {
    const [data] = await pool.query(sql, params);
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

/* 
gäller för endpointen: http://localhost:3007/categories/:category_name (exempelvis Audio eller Computers)
app.use("/categories", categoryRoutes);
router.get("/:category_name", categoryController.getAllProductsByCategoryName);
*/

exports.getAllProductsByCategoryName = async (req, res) => {
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

/*
exports.getAllProductsByCategoryId = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT products.*, 
      categories.category_name,
      FROM product_categories
      JOIN products ON products.product_id = product_categories.product_id
      JOIN categories ON categories.category_id = product_categories.category_id
      WHERE categories.category_id = ?`,
      [req.params.category_id],
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
*/
