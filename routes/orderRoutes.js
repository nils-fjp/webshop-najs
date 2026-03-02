const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.getAllOrders);
router.post("/", orderController.createOrder);

// gets the global order_id and not the one specific to the user. needs fixing
router.get("/:order_id", orderController.getOrderById);

module.exports = router;
