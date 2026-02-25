const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");

router.get("/customer/:id/order", orderController.getOrdersByCustomerId);
router.post("/customer/:id/order", orderController.createForCustomer);

module.exports = router;