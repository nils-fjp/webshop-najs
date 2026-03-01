const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3007;

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hej");
});

app.use("/products", productRoutes);
app.use("/admin", adminRoutes);
app.use("/categories", categoryRoutes);
app.use("/", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
