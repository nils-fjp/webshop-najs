const pool = require("../config/db");

/* 
gäller för endpointen: http://localhost:3007/products 
app.use("/products", productRoutes);
app.get("/products", productController.getAllProducts);
*/

exports.getAllProducts = async (req, res) => {
  let sql = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (req.query.search) {
    sql += " AND product_name LIKE ?";
    params.push(`%${req.query.search}%`);
  }

  try {
    const [data] = await pool.query(sql, params);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
  }
};

/*
// Koden för frontend som hämtar alla produkter och renderar dem i en tabell, samt implementerar sökfunktionalitet:
const renderTable = (data) => {
        table.innerHTML =
          `<tr>${Object.keys(data[0]).map((name) => `<td><b>${name}</b></td>`)
            .join``}</tr>` +
          data.map(
            (row) =>
              `<tr>${Object.values(row).map((col) => `<td>${col}</td>`)
                .join``}</tr>`,
          ).join``;
      };
      getBtn.addEventListener("click", async (event) => {
        event.preventDefault();
        data = await fetch(
          `http://localhost:${port.value}/${endpoint.value}`,
        ).then((res) => res.json());
        renderTable(data);
      });
      searchField.addEventListener("input", async () => {
        data = await fetch(
          `http://localhost:${port.value}/${endpoint.value}?search=${searchField.value}`,
        ).then((res) => res.json());
        renderTable(data);
      });
*/

exports.getProductById = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT * FROM products WHERE product_id = ?`,
      [req.params.product_id],
    );
    res.status(200).send(data);
  } catch (err) {
    res.status(500).send(err);
  }
};
