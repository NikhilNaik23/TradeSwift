import mongoose from "mongoose";
import Report from "../models/reportModel.js";
import Product from "../models/productModel.js";

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

export const reportProduct = async (req, res) => {
  const { id: productId } = req.params;
  const { reason, message } = req.body;

  if (!isValidObjectId(productId)) {
    return res.status(400).json({ message: "Invalid product ID" });
  }

  try {
    const product = await Product.findById(productId);
    if (!product || product.status === "sold") {
      return res
        .status(404)
        .json({ message: "Product not found or already sold" });
    }

    const existingReport = await Report.findOne({
      product: productId,
      reporter: req.user._id,
    });

    if (existingReport) {
      return res
        .status(409)
        .json({ message: "You already reported this product" });
    }

    const report = await Report.create({
      reporter: req.user._id,
      product: productId,
      reason,
      message,
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Report Product Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ isDeleted: false })
      .populate("reporter", "name email")
      .populate("product", "title status");

    res.status(200).json(reports);
  } catch (error) {
    console.error("Get All Reports Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resolveReport = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid report ID" });
  }

  if (!["reviewed", "resolved", "dismissed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updated = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Report not found" });
    }

    res
      .status(200)
      .json({ message: `Report marked as ${status}`, report: updated });
  } catch (error) {
    console.error("Resolve Report Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
