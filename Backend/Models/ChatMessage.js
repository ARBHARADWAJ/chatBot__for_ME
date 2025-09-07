// const mongoose = require("mongoose");
import mongoose from "mongoose";
const chatSchema = new mongoose.Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    
  },
  { timestamps: true }
);

const Chat = mongoose.model("chat", chatSchema);
export default Chat;
