const { get } = require("../app");
const orderModel = require("../models/order.model");

const orderController = {
  getOrdersByCustomerId: async (req, res) => {
    try {
    const customerID = Number(req.params.id);
    if(Number.isNaN(customerID)) {
        return res.status(400).json({ error: "Invalid customer ID" });
    }
    const data = await orderModel.findOrdersByCustomerId(customerID);
    res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
  },
  createForCustomer: async (req, res) => {
    try {
      const customerID = Number(req.params.id);
      if(Number.isNaN(customerID)) {
          return res.status(400).json({ error: "Invalid customer ID" });
      }
      const {
        shippingAddress_id,
        shippingMethod_id,
        totalPrice,
        order_items
      } = req.body;
      if (
        shippingAddress_id === undefined ||
        shippingMethod_id === undefined ||
        totalPrice === undefined ||
        order_items === undefined
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }
      if(!Array.isArray(order_items) || order_items.length === 0) {
        return res.status(400).json({ error: "Order items must be a non-empty array" });
      }
    for(const item of order_items) {
      if (item.product_id === undefined ||
        item.product_quantity === undefined ||
        item.item_price === undefined) {
          return res.status(400).json({ error: "Each order item must have product_id, product_quantity and item_price" });
      }
    }
    const orderId = await orderModel.createForCustomer(customerID, {
      shippingAddress_id,
      shippingMethod_id,
      totalPrice,
      order_items
    });
    res.status(201).json({message: "Order created successfully", orderId});
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
},
getAllAdmin: async (req, res) => {
    try {
      const orders = await orderModel.findAllAdmin();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
},

};
module.exports = orderController;