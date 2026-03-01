const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/:username/orders", userController.getAllOrders);

// gets the global order_id and not the one specific to the user. needs fixing
router.get("/:username/orders/:order_id", userController.getOrderById);

module.exports = router;
