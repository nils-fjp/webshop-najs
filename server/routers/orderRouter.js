const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const adminAuth = require("../middleware/adminAuth");
// Customer routes
router.get("/customer/:id", orderController.getOrdersByCustomerId);

router.post("/customer/:id", orderController.createForCustomer);
// Admin routes
router.get("/admin", adminAuth, orderController.getAllAdmin);
// Get/order/admin/:id
router.get("/admin/:id", adminAuth, orderController.getByIdAdmin);

module.exports = router;
