const connection = require("../config/db");

exports.getAll = (req, res) => {
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (req.query.search) {
    sql += " AND product_name LIKE ?";
    params.push(`%${req.query.search}%`);
  }

  connection.query(sql, params, (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
};

exports.getById = (req, res) => {
  connection.query(
    `SELECT * FROM products WHERE product_id = ?`,
    [req.params.id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    },
  );
};
