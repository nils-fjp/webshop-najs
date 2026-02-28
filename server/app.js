//server/app.js
const express = require("express"); // Import Express framework for building the server
const cors = require("cors"); // Import CORS middleware to enable Cross-Origin Resource Sharing
const db = require("./config/db"); // Import database connection (not used directly here but can be used for testing the connection)

// Import routers for different resources

const productRouter = require("./routers/productRouter"); // Router for product-related endpoints
const orderRouter = require("./routers/orderRouter"); // Router for order-related endpoints
const categoryRouter = require("./routers/categoryRouter"); // Router for category-related endpoints

const errorHandler = require("./middleware/errorHandler"); // Import custom error handling middleware

const app = express(); // Create an instance of the Express application

app.use(cors()); // Enable CORS for all routes (you can configure this further to allow specific origins, methods, etc.)
app.use(express.json()); // Middleware to parse JSON request bodies (for POST, PUT, PATCH requests)

app.get("/", (req, res) => { // Basic route to test if the server is running
    res.status(200).send("Hej"); // Send a simple response to indicate the server is up (you can change this to something more informative if needed)
});

app.use("/products", productRouter); // Use the product router for all routes starting with /products
app.use("/orders", orderRouter); // Use the order router for all routes starting with /orders
app.use("/categories", categoryRouter); // Use the category router for all routes starting with /categories

app.use(errorHandler); // Use custom error handling middleware (should be added after all routes to catch errors from them)

module.exports = app; // Export the app to be used in the server startup file (e.g., index.js)