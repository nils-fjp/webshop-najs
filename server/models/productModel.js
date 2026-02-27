const cn = require("../config/db");

const productModel = {
  findAll: async () => {
    return new Promise((resolve, reject) => {
      cn.query("SELECT * FROM products", (err, results) => {
        if (err) return reject(err);
        resolve(results);
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
  updateById: (productId, productData) => {
    return new Promise((resolve, reject) => {
      cn.query(
        `UPDATE products SET product_name = ?, product_code = ?, listing_price = ?, stock_quantity = ?, product_description = ? WHERE product_id = ?`,
        [
          productData.product_name,
          productData.product_code,
          productData.listing_price,
          productData.stock_quantity,
          productData.product_description,
          productId,
        ],
        (err, result) => {
          if (err) return reject(err);
          resolve(result.affectedRows);
        }
      );
    });
  },
  patchById: (productId, updates) => {
    return new Promise((resolve, reject) => {
      const setClause = Object.keys(updates)
        .map((field) => `${field} = ?`)
        .join(", ");
      const values = Object.values(updates);
      values.push(productId);
      cn.query(
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

module.exports = productModel;
