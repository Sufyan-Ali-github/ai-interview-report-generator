import userModel from "../models/user.model.js";
import blacklistModel from "../models/blacklist.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Account already exist with this email or username" });
    }

    const newUser = new userModel({
      username,
      email,
      password,
    });

    await newUser.save();

    const token = jwt.sign(
      {_id: newUser._id, username: newUser.username},
      process.env.JWT_SECRET || "Sunnyking5566",
      { expiresIn: "2d" },
    );

    //set cookie
   res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2 * 24 * 60 * 60 * 1000
    })

    res.status(201).json({ message: "User registered successfully", user: { id: newUser._id, username: newUser.username, } });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await userModel.findOne({ email });

    if (!existingUser) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        _id: existingUser._id,
        username: existingUser.username,
       
      },
      process.env.JWT_SECRET || "Sunnyking5566",
      { expiresIn: "2d" },
    );

    //set cookie
     res.cookie('token', token, {
       httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 2 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({ message: "User logged in successfully", user: { id: existingUser._id, username: existingUser.username } });
  } catch (error) {
 
    res.status(500).json({ message: "Internal server error", error });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (token) {
      await blacklistModel.create({ token });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUser = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message:"Successfully Fetch", user: user });
  } catch (error) {
    console.error("Error getting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
