import Message from "../Models/MessageSchema.js";
import ChatSession from "../Models/ChatSession.js";

//Front end use this to load sessions at login
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
//Front end use this to load sessions at login with session id
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


//genai operations for prompt and response
//TODO: limit this and redis this
export const exportMessages = async (sessionId, noOfMesaages) => {
  try {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }
    const messages = await Message.find({ chatSessionId: sessionId })
      .sort({
        createdAt: -1,
      })
      .limit(noOfMesaages)
      .select("role message -_id");
    return messages;
  } catch (error) {
    console.log(error);
    return [];
  }
};

//TODO: limit this and redis this
export const exportNoOfMessages = async (sessionId) => {
  try {
    if (!sessionId) {
      throw new Error("Session ID is required");
    }
    const messages = await Message.find({ chatSessionId: sessionId });
    return messages.length;
  } catch (error) {
    console.log(error);
    return [];
  }
};

