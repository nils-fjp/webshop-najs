const pool = require("../config/db");

exports.getAllProducts = async (req, res) => {
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (req.query.search) {
    sql += " AND product_name LIKE ?";
    params.push(`%${req.query.search}%`);
  }

  try {
    const [data] = await pool.query(sql, params);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getProductById = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT * FROM products WHERE product_id = ?`,
      [req.params.product_id],
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
