import mongoose from "mongoose";
import Product from "../models/productModel.js";
import WishList from "../models/wishlistModel.js";

const objectId = (id) => mongoose.Types.ObjectId.isValid(id);
export const addToWishlist = async (req, res) => {
  const { id: productId } = req.params;
  if (!objectId(productId)) {
    return res.status(400).json({ message: "Invalid Product Id" });
  }
  try {
    const existingProduct = await Product.findById(productId);
    if (!existingProduct || existingProduct.status === "sold") {
      return res
        .status(400)
        .json({ message: "Product is either not available or has sold" });
    }
    const existingItemInList = await WishList.findOne({
      user: req.user._id,
      product: productId,
    });
    if (existingItemInList) {
      return res.status(403).json({ message: "Item is already in wishlist" });
    }
    const newItem = await WishList.create({
      user: req.user._id,
      product: productId,
    });
    res.status(201).json({ message: "Item added to Cart" });
  } catch (error) {
    console.log("addToWishlist Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await WishList.find({ user: req.user._id }).populate("product");
    res.status(200).json({ wishlist });
  } catch (error) {
    console.error("getWishlist Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromWishlist = async (req, res) => {
  const { id: cartId } = req.params;
  if (!objectId(cartId)) {
    return res.status(400).json({ message: "Invalid Product Id" });
  }

  try {
    const deletedItem = await WishList.findOneAndDelete({
      user: req.user._id,
      _id: cartId,
    });

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (error) {
    console.error("removeFromWishlist Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const clearCart = async (req, res) => {
  try {
    await WishList.deleteMany({ user: req.user._id });
    res.status(200).json({ message: "Wishlist cleared" });
  } catch (error) {
    console.error("clearCart Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
