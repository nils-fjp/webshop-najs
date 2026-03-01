const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/", categoryController.getAllCategories);
router.get("/:category_name", categoryController.getAllProductsByCategory);

module.exports = router;
