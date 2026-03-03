const connection = require("../config/db");

exports.getAddressesByCustomerId = (req, res) => {
  const { customer_id } = req.params;

  connection.query(
    "SELECT * FROM customer_addresses WHERE customer_id = ?",
    [customer_id],
    (err, data) => {
      if (err) return res.status(500).send(err);
      res.status(200).send(data);
    }
  );
};