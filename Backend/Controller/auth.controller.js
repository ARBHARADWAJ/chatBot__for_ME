import User from "../Models/User.js";
import bcrypt from "bcryptjs"; //for encryption
import jwt from "jsonwebtoken"; //for token generation
import dotenv from "dotenv";

export const registerUser = async (req, res) => {
  console.log(req.body);

  const { name, email, password } = req.body;
  console.log("Registering user with data:", req.body);
  try {
    const userExisting = await User.findOne({ email });
    if (userExisting)
      return res.status(400).json({ message: "User already exist" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    const token = jwt.sign({ id: user._id }, "process.env.JWT_SECRET", {
      expiresIn: "1h",
    });

    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(password, user.password, isPasswordValid);

    if (!isPasswordValid) {
      console.log("invalid");

      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, "process.env.JWT_SECRET", {
      expiresIn: "1h",
    });
    console.log(token);
    return res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Error in logging in user", error);
    return res.status(500).json({ message: "Login failed" });
  }
};

function logout(params) {
  
}


