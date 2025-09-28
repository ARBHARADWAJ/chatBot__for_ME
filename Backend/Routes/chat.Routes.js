import express from "express";
const router = express.Router();
import User from "../Models/User.js";
import Message from "../Models/MessageSchema.js";


router.post("/chats", async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.sendStatus(400);
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decode.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const session = await chatSession
      .find({ userId: user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json({ sessions: session });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages" });
  }
});
router.post("/messages", async (req, res) => {
  
});

export default router;
