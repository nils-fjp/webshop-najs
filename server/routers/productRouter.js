const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");

// GET /api/products
router.get("/", productController.getAll);
// GET /api/products/admin
router.get("/admin", productController.getAllAdmin);
// POST /api/products/admin (admin only)
router.post("/admin", productController.createAdmin);
// GET /api/products/:id
router.get("/:id", productController.getProductById);
// PUT /api/products/:id (admin only)
router.put("/admin", productController.updateAdmin);
//PATCH /api/products/:id (admin only)
router.patch("/admin", productController.patchAdmin);
// DELETE /api/products/:id (admin only)
router.delete("/admin", productController.deleteAdmin);
//
router.get("/admin/:id", productController.getAdminById);
router.post("/admin/:id", productController.createAdminWithId);
router.put("/admin/:id", productController.updateAdminById);
router.patch("/admin/:id", productController.patchAdminById);
router.delete("/admin/:id", productController.deleteAdminById);

module.exports = router // Export the router to be used in the main app
