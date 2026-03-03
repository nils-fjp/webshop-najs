const express = require("express");
const router = express.Router();
const shippingController = require("../controllers/shippingController");

router.get("/", shippingController.getShippingMethods);

module.exports = router;