const mysql = require("mysql2"); // Import the mysql2 library to create a connection to the MySQL database
require("dotenv").config(); // Load environment variables from a .env file (make sure to create this file with your database credentials)

// Create a connection to the MySQL database using credentials from environment variables

const connection = mysql.createConnection({ // Create a connection to the MySQL database using credentials from environment variables
  host: process.env.DB_HOST, // Database host (e.g., localhost or an IP address)
  user: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Database password
  database: process.env.DB_NAME, // Database name to connect to
});

connection.connect((err) => { // Connect to the database and handle any connection errors
  if (err) { // Log error and exit process if connection fails
    console.error("Fel vid anslutning:", err); // In production, consider logging this error to a file or monitoring service instead of the console
    process.exit(1); // Exit the process with a non-zero code to indicate failure
  }
  console.log("MySQL ansluten!"); // Log a success message when the connection is established (you can remove this in production or replace it with a more secure logging mechanism)
});

module.exports = connection; // Export the connection to be used in other parts of the application (e.g., models)
