// server/controllers/loginController.js
const pool = require("../config/db");

exports.login = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: "Email is required" });

  try {
    const [rows] = await pool.query(
      "SELECT customer_id, first_name, last_name, email FROM customers WHERE email = ?",
      [email]
    );

    if (!rows.length) return res.status(401).json({ error: "User not found" });

    res.status(200).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
