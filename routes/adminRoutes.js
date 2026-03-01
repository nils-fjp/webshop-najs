const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");

router.get("/", (req, res) => {
  res.status(200).send("Admin route");
});

// admin orders by request body
router.get("/orders", adminController.getAllOrders);

// admin products by request body
router.get("/products", productController.getAllProducts);
router.post("/products", adminController.postProducts);
router.patch("/products", adminController.patchProducts);
router.put("/products", adminController.putProducts);
router.delete("/products", adminController.deleteProducts);

// admin orders by route params
router.get("/orders/:order_id", adminController.getOrderById);

// admin products by route params
router.get("/products/:product_id", productController.getProductById);
router.post("/products/:product_id", adminController.postProductById);
router.patch("/products/:product_id", adminController.patchProductById);
router.put("/products/:product_id", adminController.putProductById);
router.delete("/products/:product_id", adminController.deleteProductById);

module.exports = router;
