const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.get("/customer/:id", orderController.getOrdersByCustomerId);
router.post("/customer/:id", orderController.createForCustomer);
router.get("/admin", orderController.getAllAdmin); // example of an admin-only route, would need adminAuth middleware

module.exports = router;