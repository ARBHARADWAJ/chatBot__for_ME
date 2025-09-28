import Message from "../Models/MessageSchema.js";
import ChatSession from "../Models/ChatSession.js";

export const chatSessionExport = async (userId) => {
  try {
    const session = await ChatSession.find({ userId: userId }).sort({
      updatedAt: -1,
    });
    return session;
  } catch (error) {
    throw new Error("Failed to retrieve chat sessions");
  }
};

export const chatMessagesExport = async (sessionId) => {
  try {
    if (!sessionId) {
      return res.sendStatus(400);
    }
    const messages = await Message.find({ chatSessionId: sessionId }).sort({
      createdAt: -1,
    });

    res.status(200).json({ messages: messages });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages" });
  }
};

