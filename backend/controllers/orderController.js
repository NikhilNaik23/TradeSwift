import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";

export const createOrder = async (req, res) => {
  try {
    const { product: productId, amount } = req.body;
    const buyerId = req.user._id;

    const product = await Product.findById(productId).populate("owner");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.status === "sold") {
      return res.status(400).json({ message: "Product already sold" });
    }

    if (product.owner._id.toString() === buyerId.toString()) {
      return res.status(400).json({ message: "You cannot buy your own product" });
    }

    const order = await Order.create({
      buyer: buyerId,
      seller: product.owner._id,
      product: productId,
      amount,
      status: "pending",
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("product")
      .populate("seller", "name email");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrdersAsSellers = async (req, res) => {
  try {
    const orders = await Order.find({ seller: req.user._id })
      .populate("product")
      .populate("buyer", "name email");

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("product")
      .populate("buyer", "name email")
      .populate("seller", "name email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (
      order.buyer.toString() !== req.user._id.toString() &&
      order.seller.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Unauthorized access" });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
