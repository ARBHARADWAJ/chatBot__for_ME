import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
//validator type functions
const Protect = async (req, res, next) => {
  let token;
  if (
    req.header.authorization &&
    req.header.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.header.authorization.split(" ")[1];
      console.log(req.header.authorization.split(" "));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.log(error.message);
      res.status(401).json({
        message: "Not authorized, token failed",
      });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

// This middleware checks if the user is authenticated and has admin privileges.
// If the user is authenticated, it allows the request to proceed to the next middleware or route handler.
// If the user is not authenticated, it returns a 401 Unauthorized response.
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Admin access only" });
  }
};

export { Protect, admin };
