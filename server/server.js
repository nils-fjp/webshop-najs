// server/server.js
const app = require("./app"); // Import the Express app from app.js

const PORT = process.env.PORT || 3007; // Start the server and listen on the specified port, logging a message to indicate it's running

app.listen(PORT, () => { // Log a message to the console when the server starts successfully
  console.log(`Server running on port ${PORT}`); // In production, consider using a logging library like Winston or Bunyan for better log management
});