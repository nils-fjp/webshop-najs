const express = require("express");
const app = express();
const PORT = 3007;
const cors = require("cors");

const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");

app.use(cors());
app.use(express.json());

app.use("/products", productRoutes);
/* app.use("/", orderRoutes); */

app.listen(PORT);
