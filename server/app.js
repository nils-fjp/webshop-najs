//server/app.js
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const productRouter = require("./routers/productRouter");
const orderRouter = require("./routers/orderRouter");
const categoryRouter = require("./routers/categoryRouter");

const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.status(200).send("Hej");
});

app.use("/products", productRouter);
app.use("/orders", orderRouter);
app.use("/categories", categoryRouter);

app.use(errorHandler);

module.exports = app;