import generateResponse from "../Utils/generateResponses.js";
import ChatSession from "../Models/ChatSession.js";
import Message from "../Models/MessageSchema.js";
import { DecodeUserId } from "./auth.controller.js";
import User from "../Models/User.js";
import ChatSession from "../Models/ChatSession.js";

//for /chat session loading
export const load_ChatSessions_Login = async (req, res) => {
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
    const session = await ChatSession.find({ userId: user._id }).sort({
      updatedAt: -1,
    });

    res.status(200).json({ sessions: session });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve messages" });
  }
};

//to server main file
export const createChatSession = async (socket, data) => {
  const { title } = data;
  try {
    const newSession = new ChatSession({
      userId: socket.userId,
      sessionId: socket.id,
      title: title || "new chat",
    });
    await newSession.save();
    // socket.emit("chat_created", { message: "sessoin created" });
    const sessions = await ChatSession.find({ userId: socket.userId });
    console.log("Loaded chat sessions:", sessions);
    socket.emit("load_sessions", sessions);
  } catch (error) {
    console.error("Error creating new chat session:", error);
    socket.emit("error", { message: "Could not create a new chat." });
  }
};

export const handleChatMessages = async (socket, data) => {
  try {
    const { message, sessionid } = data;

    if (!socket.userId) {
      console.log("socket error");
      return socket.emit("error", { message: "Session ID is missing." });
    }
    const userMessage = new Message({
      role: "user",
      message: message,
      chatSessionId: sessionid + "",
    });
    const ll = await userMessage.save();
    console.log(ll);

    const airesponse = await generateResponse(sessionid, message);
    // console.log("AI Response:", airesponse);

    const botMessage = new Message({
      role: "bot",
      message: airesponse,
      chatSessionId: sessionid + "",
    });

    // console.log("Bot message to be saved:", botMessage);
    const l = await botMessage.save();
    console.log(l);

    socket.emit("chat message", airesponse);
  } catch (error) {
    console.log("error in handling chat message", error);
  }
};

//for front end to load sessions at login
export const loadChatSessions = async (socket, data) => {
  try {
    const { token } = data;
    if (!token) {
      return socket.emit("error", { message: "User ID is missing." });
    }
    const sessions = await ChatSession.find({ userId: socket.userId });
    // console.log("Loaded chat sessions:", sessions);
    socket.emit("load_sessions", sessions);
  } catch (error) {
    console.log("error in handling chat message", error);
  }
};

export const loadChatMessages = async (socket, data) => {
  try {
    const { sessionId } = data;

    if (!sessionId) {
      return socket.emit("error", { message: "Session ID is missing." });
    }
    const messages = await Message.find({ chatSessionId: sessionId });
    // console.log("Loaded chat messages:", { messages: messages, sessionId: sessionId });
    socket.emit("load_messages", { messages: messages, sessionId: sessionId });
  } catch (error) {
    console.log("error in handling chat message", error);
  }
};
