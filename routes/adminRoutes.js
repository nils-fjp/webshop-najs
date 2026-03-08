const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const productController = require("../controllers/productController");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Admin route" });
});

// admin orders by request body
router.get("/orders", adminController.getAllOrders);

// admin orders by route params
router.get("/orders/:order_id", adminController.getOrderById);

// admin products (works with both /products and /products/:product_id)
router.get("/products", productController.getAllProducts);
router.get("/products/:product_id", productController.getProductById);
router.post("/products", adminController.postProduct);
router.patch("/products", adminController.patchProduct);
router.patch("/products/:product_id", adminController.patchProduct);
router.put("/products", adminController.putProduct);
router.put("/products/:product_id", adminController.putProduct);
router.delete("/products", adminController.deleteProduct);
router.delete("/products/:product_id", adminController.deleteProduct);

module.exports = router;
