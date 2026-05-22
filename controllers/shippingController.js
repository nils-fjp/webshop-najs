// server/controllers/shippingController.js
const pool = require("../config/db");

exports.getShippingMethods = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM shipping_methods");
    res.status(200).json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
