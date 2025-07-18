import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (user_id) => {
  const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

export const registerUser = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const newUser = await User.create({
      name,
      email,
      password,
      address,
    });

    const token = generateToken(newUser._id);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "Strict",
      })
      .status(201)
      .json({
        message: "User created successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (error) {
    console.log("registerUser controller error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid Email or Password" });
    }
    if (!user.isActive) {
      return res.status(403).json({
        message: "Please verify your email to activate your account.",
      });
    }

    const token = generateToken(user._id);
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "Logged in successfully" });
  } catch (error) {
    console.log("loginUser controller error: ", error);
    return res.status(500).json({
      message: "Internal Server Error",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  }
};

export const getUserProfile = async (req, res) => {
  const { _id: id } = req.user;
  try {
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.log("getUserProfile Controller Error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { name, role, address } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (role && !["buyer", "seller"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (name) user.name = name;
    if (role) user.role = role;
    if (address) {
      user.address = {
        ...user.address,
        ...address,
      };
    }
    await user.save();
    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.log("updateUserProfile controller error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deactivateAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = false;
    await user.save();

    res.clearCookie("token");
    return res
      .status(200)
      .json({ message: "Account deactivated successfully" });
  } catch (error) {
    console.log("deactivateAccount controller error: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const switchRole = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.role = user.role === "buyer" ? "seller" : "buyer";
    await user.save();
    res.status(200).json({
      message: `Role switched successfully to ${user.role}`,
      role: user.role,
    });
  } catch (error) {
    console.error("Error switching role:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
