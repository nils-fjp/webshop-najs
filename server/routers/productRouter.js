const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const adminAuth = require("../middleware/adminAuth");

// GET /api/products
router.get("/", productController.getAll);
// GET /api/products/admin
router.get("/admin", adminAuth, productController.getAllAdmin);
// POST /api/products/admin (admin only)
router.post("/admin", adminAuth, productController.createAdmin);
// GET /api/products/:id
router.get("/:id", productController.getProductById);
// PUT /api/products/:id (admin only)
router.put("/admin", adminAuth, productController.updateAdmin);
//PATCH /api/products/:id (admin only)
router.patch("/admin", adminAuth, productController.patchAdmin);
// DELETE /api/products/:id (admin only)
router.delete("/admin", adminAuth, productController.deleteAdmin);
//
router.get("/admin/:id", adminAuth, productController.getAdminById);
router.post("/admin/:id", adminAuth, productController.createAdminWithId);
router.put("/admin/:id", adminAuth, productController.updateAdminById);
router.patch("/admin/:id", adminAuth, productController.patchAdminById);
router.delete("/admin/:id", adminAuth, productController.deleteAdminById);

module.exports = router
