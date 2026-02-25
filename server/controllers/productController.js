const productModel = require("../models/productModel");

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
  
};


module.exports = productController;