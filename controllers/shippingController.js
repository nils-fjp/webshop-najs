const connection = require("../config/db");

exports.getShippingMethods = (req, res) => {
  connection.query("SELECT * FROM shipping_methods", (err, data) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(data);
  });
};