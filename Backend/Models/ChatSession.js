import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "New Chat",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Links this conversation to a specific user
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const ChatSession = mongoose.model("ChatSession", chatSessionSchema);
export default ChatSession;
