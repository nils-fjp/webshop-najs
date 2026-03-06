// server/controllers/shippingController.js
const pool = require("../config/db");

exports.getShippingMethods = async (req, res) => {
  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query("SELECT * FROM shipping_methods");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
};