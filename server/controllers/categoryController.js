const categoryModel = require("../models/category.model");

const categoryController = {
  getProductById: async (req, res) => {
    try {
        const categories = await categoryModel.findProductsByCategoryId(req.params.id);
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
  }
};

module.exports = categoryController;