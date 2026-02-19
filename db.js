const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "webshop-db",
});

connection.connect((err) => {
  if (err) {
    console.error("Fel vid anslutning:", err);
    process.exit(1);
  }
  console.log("MySQL ansluten!");
});

module.exports = connection;
