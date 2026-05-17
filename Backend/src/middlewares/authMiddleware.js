import blacklistModel from "../models/blacklist.model.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    // check blacklist
    const isBlacklisted = await blacklistModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "Sunnyking5566"
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};