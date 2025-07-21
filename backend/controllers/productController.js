import mongoose from "mongoose";
import Product from "../models/productModel.js";
import cloudinary from "../config/cloudinary.js";
import User from "../models/userModel.js";
const objectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const createProduct = async (req, res) => {
  const data = JSON.parse(req.body.data);
  const { title, description, price, category, condition, phone } = data;
  const user_id = req.user?._id;

  const missing = [];
  if (!title) missing.push("title");
  if (!description) missing.push("description");
  if (!price) missing.push("price");
  if (!category) missing.push("category");
  if (!condition) missing.push("condition");
  if (!phone) missing.push("phone");
  if (!req.files || req.files.length === 0) missing.push("images");
  console.log(req.files);
  console.log(req.files.length);
  console.log(missing);

  if (missing.length > 0) {
    return res.status(400).json({
      message: "Validation Error: Missing required fields",
      missingFields: missing,
    });
  }

  try {
    const user = await User.findById(user_id);
    const contactInfo = {
      contactNumber: phone,
      email: user.email,
    };
    const imageUrls = req.files.map((file) => file.path);

    const product = new Product({
      title,
      description,
      price,
      category,
      condition,
      images: imageUrls,
      location: user.address,
      contactInfo,
      postedBy: user_id,
    });

    await product.save();

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(
      "❌ createProduct Controller Error:",
      JSON.stringify(error, null, 2)
    );

    res.status(500).json({
      message: "Internal Server Error",
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, location, condition, search } = req.query;

    const filter = { status: "available" };

    if (category) filter.category = category;
    if (location) filter["location.city"] = location;
    if (condition) filter.condition = condition;

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("postedBy", "name email");
    res.status(200).json({
      page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
      products,
    });
  } catch (error) {
    console.error("getAllProducts Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  const { id: productId } = req.params;
  if (!objectId(productId)) {
    return res.status(400).json({ message: "Invalid Product Id" });
  }
  try {
    const product = await Product.findById(productId).populate(
      "postedBy",
      "name"
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    console.error("getProductById Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProduct = async (req, res) => {
  const { id: productId } = req.params;
  const user_id = req.user._id;

  if (!objectId(productId)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }

  const {
    title,
    description,
    price,
    category,
    images,
    location,
    contactInfo,
    condition,
  } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.postedBy.toString() !== user_id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your product" });
    }

    if (product.status === "sold") {
      return res
        .status(400)
        .json({ message: "Cannot update a product that's already sold" });
    }

    const isIdentical =
      product.title === title &&
      product.description === description &&
      product.price === price &&
      product.category === category &&
      JSON.stringify(product.images) === JSON.stringify(images) &&
      product.location === location &&
      product.contactInfo === contactInfo &&
      product.condition === condition;

    if (isIdentical) {
      return res.status(400).json({ message: "No changes detected in update" });
    }
    product.title = title || product.title;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.images = images || product.images;
    product.location = location || product.location;
    product.contactInfo = contactInfo || product.contactInfo;
    product.condition = condition || product.condition;

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("updateProduct Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const markProductAsSold = async (req, res) => {
  const { id: productId } = req.params;
  const user_id = req.user._id;
  if (!objectId(productId)) {
    return res.status(400).json({ message: "Invalid Product ID" });
  }
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    if (product.postedBy.toString() !== user_id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized: Not your product" });
    }
    if (product.status === "sold") {
      return res
        .status(400)
        .json({ message: "Product is already marked as sold" });
    }
    product.status = "sold";
    await product.save();
    res.status(200).json({ message: "Marked as sold" });
  } catch (error) {
    console.error("markProductAsSold Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllProductsOfSeller = async (req, res) => {
  const user_id = req.user._id;

  try {
    const products = await Product.find({ postedBy: user_id }).sort({
      createdAt: -1,
    });

    res.status(200).json({ total: products.length, products });
  } catch (error) {
    console.error("getAllProductsOfSeller Controller Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const destroyPromises = product.images.map((url) => {
      const publicId = getPublicIdFromUrl(url);
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(destroyPromises);

    await product.deleteOne();

    res.status(200).json({ message: "Product and images deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getPublicIdFromUrl = (url) => {
  const parts = url.split("/");
  const filename = parts.pop().split(".")[0];
  const folder = parts.slice(parts.indexOf("upload") + 1).join("/");
  return `${folder}/${filename}`;
};
