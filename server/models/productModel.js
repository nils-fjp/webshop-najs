const cn = require("../config/db"); // Import database connection

// Product model with database interaction functions

const productModel = { // Get all products (for customers)
  findAll: async () => { // Return a promise that resolves with the list of products
    return new Promise((resolve, reject) => { // Query to select all products from the database
      cn.query("SELECT * FROM products", (err, results) => { // Handle database query results
        if (err) return reject(err); // Reject promise on error
        resolve(results); // Resolve promise with results on success
      });
    });
  },
  findById: async (id) => {
    return new Promise((resolve, reject) => {
      cn.query(
        "SELECT * FROM products WHERE product_id = ?",
        [id],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
  findAllAdmin: async () => {
    return new Promise((resolve, reject) => {
      cn.query("SELECT * FROM products ORDER BY product_id DESC", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
  createAdmin: async (product) => {
    const {
      product_name,
      product_code,
      listing_price,
      stock_quantity,
      product_description,
    } = product;

    return new Promise((resolve, reject) => {
      cn.query(
        `INSERT INTO products (product_name, product_code, listing_price, stock_quantity, product_description)
         VALUES (?, ?, ?, ?, ?)`,
        [
          product_name,
          product_code,
          listing_price,
          stock_quantity,
          product_description,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  },
  // Admin functions for updating, patching, and deleting products by ID
  updateById: (productId, productData) => { // Update product by ID with new data
    return new Promise((resolve, reject) => { // Query to update product in the database
      cn.query( // Update all fields of the product with the given ID
        `UPDATE products SET product_name = ?, product_code = ?, listing_price = ?, stock_quantity = ?, product_description = ? WHERE product_id = ?`,
        [ // Values to update, including the product ID for the WHERE clause
          productData.product_name,
          productData.product_code,
          productData.listing_price,
          productData.stock_quantity,
          productData.product_description,
          productId,
        ], // Handle database query results
        (err, result) => {
          if (err) return reject(err); // Reject promise on error
          resolve(result.affectedRows); // Resolve promise with number of affected rows on success
        }
      );
    });
  },
  // Patch product by ID with only provided fields
  patchById: (productId, updates) => {
    // Build dynamic SET clause based on provided fields in updates object
    return new Promise((resolve, reject) => { // Create SET clause and values array for the UPDATE query
      const setClause = Object.keys(updates) // Map update fields to "field = ?" format for SQL query
        .map((field) => `${field} = ?`) 
        .join(", "); // Extract values from updates object and add productId at the end for the WHERE clause
      const values = Object.values(updates); // Add productId to values array for the WHERE clause
      values.push(productId); // Query to update only provided fields of the product with the given ID
      cn.query( // Update only provided fields of the product with the given ID
        `UPDATE products SET ${setClause} WHERE product_id = ?`,
        values,
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows);
        }
      );
    });
  },
  deleteById: (productId) => {
    return new Promise((resolve, reject) => {
      cn.query(
        `DELETE FROM products WHERE product_id = ?`,
        [productId],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows);
        }
      );
    });
  },
  createWithId: (product_id, productData) => {
    return new Promise((resolve, reject) => {
      cn.query(
        `INSERT INTO  products(
          product_id,
          product_name,
          product_code,
          listing_price,
          stock_quantity,
          product_description
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          product_id,
          productData.product_name,
          productData.product_code,
          productData.listing_price,
          productData.stock_quantity,
          productData.product_description
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.insertId);
        }
      );
    });
  },
};

module.exports = productModel; // Export the model to be used in controllers
