const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

router.get("/:customer_id/addresses", addressController.getAddressesByCustomerId);

module.exports = router;