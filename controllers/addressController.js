// server/controllers/addressController.js
const pool = require("../config/db");

exports.getAddressesByCustomerId = async (req, res) => {
  const { customer_id } = req.params;

  let connection;
  try {
    connection = await pool.getConnection();
    const [rows] = await connection.query(
      "SELECT * FROM customer_addresses WHERE customer_id = ?",
      [customer_id],
    );
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  } finally {
    if (connection) connection.release();
  }
};
