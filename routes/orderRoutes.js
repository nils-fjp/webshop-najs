const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.createOrder);

// gets the global order_id and not the one specific to the user. needs fixing
// router.get("/:customer_id", orderController.getOrdersByCustomerId);

module.exports = router;
