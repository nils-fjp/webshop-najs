const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3007;

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const loginRoutes = require("./routes/loginRoutes");
const addressRoutes = require("./routes/addressRoutes");
const shippingRoutes = require("./routes/shippingRoutes");


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hej");
});

app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/orders", orderRoutes);
app.use("/login", loginRoutes);
app.use("/customers", addressRoutes);
app.use("/shipping-methods", shippingRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
