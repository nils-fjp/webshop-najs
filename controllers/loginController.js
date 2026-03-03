const connection = require("../config/db");

exports.login = (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: "Email is required" });
  }

  connection.query(
    "SELECT customer_id, first_name, last_name, email FROM customers WHERE email = ?",
    [email],
    (err, data) => {
      if (err) return res.status(500).send(err);
      if (!data.length) {
        return res.status(401).send({ message: "User not found" });
      }

      res.status(200).send(data[0]);
    }
  );
};