const productModel = require("../models/productModel");
const { getAllAdmin } = require("./orderController");

const productController = {
  getAll: async (req, res,) => {
    try {
      const products = await productModel.findAll();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({error: "Internal server error"});
    }
  },
  getProductById: async (req, res) => {
    const product = await productModel.findById(req.params.id);

    if (!product || product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  },catch (error) {
    res.status(500).json({ error: "Internal server error" });
  },
  getAllAdmin: async (req, res) => {
    try {
      const orders = await ordelmodel.findAllAdmin();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  createAdmin: async (req, res) => {
    try {
      const{
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
      const insertId = await productModel.createAdmin({
        product_name,
        product_code,
        listing_price,
        stock_quantity,
        product_description,
      });
      res.status(201).json({ message: "Product created successfully", productId: insertId });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  },
  

};


module.exports = productController;