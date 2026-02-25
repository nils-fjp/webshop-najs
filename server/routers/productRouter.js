const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// GET /api/products
router.get("/", productController.getAll);
// GET /api/products/:id
router.get("/:id", productController.getProductById);
// Example of an admin-only route, would need adminAuth middleware
router.get("/admin", productController.getAllAdmin);
// POST /api/products (admin only)
router.post("/admin", productController.createAdmin);




module.exports = router;