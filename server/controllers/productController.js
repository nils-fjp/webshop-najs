const productModel = require("../models/productModel"); // Import product model to interact with the database
// Controller functions for product routes
const productController = { 
  getAll: async (req, res) => { // GET /api/products
    try { // Call model to get all products
      const products = await productModel.findAll(); // Return products as JSON
      res.status(200).json(products); // Handle errors
    } catch (error) { // Log error and return 500 status
      res.status(500).json({ error: "Internal server error" }); // In production, consider logging the error to a file or monitoring service
    }
  },
  getProductById: async (req, res) => {
    try {
      const product = await productModel.findById(req.params.id);

      if (!product || product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAllAdmin: async (req, res) => {
    try {
      const products = await productModel.findAllAdmin();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createAdmin: async (req, res) => {
    try {
      const { // Extract fields from request body
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      } = req.body;
      // Basic validation
      if (
        product_name === undefined || // Check for missing fields
        product_code === undefined ||
        listing_price === undefined ||
        stock_quantity === undefined ||
        product_description === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const insertId = await productModel.createAdmin({ // Call model to create product
        product_name, // Return success message with new product ID
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      });
      res
        .status(201)
        .json({ message: "Product created successfully", productId: insertId });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateAdmin: async (req, res) => {
    try {
      const {
        product_id,
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      } = req.body;
      // Basic validation
      if (
        product_id === undefined) { // Check for missing product_id
        return res.status(400).json({ error: "Missing required fields" });
      }
      if (isNaN(Number(product_id))) { // Check if product_id is a valid number
        return res.status(400).json({ error: "Invalid product_id" });
      }
      const affectedRows = await productModel.updateById(product_id, { // Call model to update product
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      });
      if (affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: `Product with ID ${product_id} updated successfully` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  patchAdmin: async (req, res) => {
    try {
      // Validate product_id
      if(req.body.product_id === undefined) {
        return res.status(400).json({ error: "Missing product_id field" });
      }
      if (isNaN(Number(req.body.product_id))) {
        return res.status(400).json({ error: "Invalid product_id" });
      }
      //extract fields to update
      const updates = {}; // Only include fields that are provided in the request body
      const fields = [ // List of fields that can be updated
        "product_name",
        "product_code",
        "listing_price",
        "stock_quantity",
        "product_description",
      ];
      fields.forEach(field => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });
      //check if there are any updates
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ error: "No fields to update" });
      }
      //Call model 
      const affectedRows = await productModel.patchById(req.body.product_id, updates);
      if (affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: `Product with ID ${req.body.product_id} updated successfully` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteAdmin: async (req, res) => {
    try {
      // Validate product_id
      if (req.body.product_id === undefined) {
        return res.status(400).json({ error: "Missing product_id field" });
      }
      if (isNaN(Number(req.body.product_id))) {
        return res.status(400).json({ error: "Invalid product_id" });
      }
      const affectedRows = await productModel.deleteById(req.body.product_id);
      if (affectedRows === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json({ message: `Product with ID ${req.body.product_id} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getAdminById: async (req, res) => {
    try {
      const productId = Number(req.params.id);
      if (Number.isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const product = await productModel.findById(productId);
      if (!product || product.length === 0) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createAdminWithId: async (req, res) => {
    try {
      const productId = Number(req.params.id);
      if (Number.isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID" });
      }
      const {
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      } = req.body;
      // Basic validation
      if (
        product_name === undefined ||
        product_code === undefined ||
        listing_price === undefined ||
        stock_quantity === undefined ||
        product_description === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      const insertId = await productModel.createWithId(productId, {
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      });
      res.status(201).json({ message: `Product created with ID ${insertId}` });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateAdminById: async (req, res) => {
    try {
      const productId = Number(req.params.id);

      if (Number.isNaN(productId)) {
        return res.status(400).send("product_id must be a number. ");
      }

      const {
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      } = req.body;

      const affectedRows = await productModel.updateById(productId, {
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      });

      if (affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }

      res.status(200).send(`Product ${productId} updated. `);

    } catch (err) {
      res.status(500).send(err);
    }
  },
  patchAdminById: async (req, res) => {
    try {
      const productId = Number(req.params.id);

      if (Number.isNaN(productId)) {
        return res.status(400).send("product_id must be a number. ");
      }

      const fields = [
        "product_name",
        "product_code",
        "listing_price",
        "stock_quantity",
        "product_description",
      ];

      const updates = {};
      fields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      if (Object.keys(updates).length === 0) {
        return res.status(400).send("No fields provided for update. ");
      }

      const affectedRows = await productModel.patchById(productId, updates);

      if (affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }

      res.status(200).send(`Product ${productId} updated. `);

    } catch (err) {
      res.status(500).send(err);
    }
  },
  deleteAdminById: async (req, res) => {
    try {
      const productId = Number(req.params.id);

      if (Number.isNaN(productId)) {
        return res.status(400).send("product_id must be a number. ");
      }

      const affectedRows = await productModel.deleteById(productId);

      if (affectedRows === 0) {
        return res.status(404).send("Product not found. ");
      }

      res.status(200).send(`Product ${productId} deleted. `);

    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = productController; // Export the controller to be used in routes
