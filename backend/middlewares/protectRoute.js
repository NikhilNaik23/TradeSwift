import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized. No token provided." });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.user_id) {
      return res.status(401).json({ message: "Unauthorized. Invalid token." });
    }
    const user = await User.findById(decoded.user_id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("protectRoute error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized. Token invalid or expired." });
  }
};

export const restrictToAdminEmail = (adminEmail) => {
  return (req, res, next) => {
    if (!req.user || req.user.email !== adminEmail) {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }
    next();
  };
};

export const restrictToRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: Insufficient permissions" });
    }
    next();
  };
};
