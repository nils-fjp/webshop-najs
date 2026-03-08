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
    res.status(500).json({ error: "Internal server error" });
  }
};

/* Koden för frontend som hämtar alla produkter och renderar dem i en tabell, samt implementerar sökfunktionalitet:

const makeUrl = (urlParams) =>
  `http://localhost:${port.value}/${endpoint.value}${urlParams ?? ""}`;

// make table headers from data keys and paste values into rows and columns
const renderTable = (data) =>
  (table.innerHTML =
    // Kontrollera om data är tom
    data?.length ?
      `<tr>${Object.keys(data[0]).map((fieldName) => `<td><b>${fieldName}</b></td>`).join``}</tr>
              ${data.map(
                (dataRow) =>
                  `<tr>${Object.values(dataRow).map((dataCell) => `<td>${dataCell}</td>`).join``}</tr>`,
              ).join``}`
    : "<tr><td>Inga matchande artiklar</td></tr>");

getBtn.addEventListener(
  "click",
  async (event) => (
    event.preventDefault(),
    renderTable(await fetch(makeUrl()).then((response) => response.json()))
  ),
);
searchField.addEventListener("input", async () =>
  renderTable(
    await fetch(makeUrl(`?search=${searchField.value}`)).then((response) =>
      response.json(),
    ),
  ),
);
*/

exports.getProductById = async (req, res) => {
  try {
    const [data] = await pool.query(
      `SELECT * FROM products WHERE product_id = ?`,
      [req.params.product_id],
    );
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
