const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const adminAuth = require("../middleware/adminAuth");

// Public routes
router.get("/", productController.getAll);

// Admin routes (must be registered before /:id to avoid "admin" matching as an id)
router.get("/admin", adminAuth, productController.getAllAdmin);
router.post("/admin", adminAuth, productController.createAdmin);
router.put("/admin", adminAuth, productController.updateAdmin);
router.patch("/admin", adminAuth, productController.patchAdmin);
router.delete("/admin", adminAuth, productController.deleteAdmin);

router.get("/admin/:id", adminAuth, productController.getAdminById);
router.post("/admin/:id", adminAuth, productController.createAdminWithId);
router.put("/admin/:id", adminAuth, productController.updateAdminById);
router.patch("/admin/:id", adminAuth, productController.patchAdminById);
router.delete("/admin/:id", adminAuth, productController.deleteAdminById);

// Public param route (after /admin routes so "admin" is not matched as :id)
router.get("/:id", productController.getProductById);

module.exports = router;
