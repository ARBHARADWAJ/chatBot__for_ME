import generateResponse from "../Utils/generateResponses.js";
import ChatSession from "../Models/ChatSession.js";
import Message from "../Models/MessageSchema.js";

export const createChatSession = async (socket, data) => {
  const { title } = data;
  try {
    const newSession = new ChatSession({
      userId: socket.userId,
      sessionId: socket.id,
      title: title || "new chat",
    });
    await newSession.save();
    socket.emit("chat_created", { message: "sessoin created" });
  } catch (error) {
    console.error("Error creating new chat session:", error);
    socket.emit("error", { message: "Could not create a new chat." });
  }
};

export const handleChatMessages = async (socket, data) => {
  try {
    console.log("check 4");
    
    const { text } = data;
    console.log(text);
    
    if (!socket.Id) {
      return socket.emit("error", { message: "Session ID is missing." });
    }
    const airesponse = await generateResponse(text);
    console.log("AI Response:", airesponse);
    const userMessage = new Message({
      sender: "user",
      text: text,
      chatSessionId: socket.id,
    });
    await userMessage.save();
    console.log("User message saved:", userMessage);

    const botMessage = new Message({
      sender: "bot",
      text: airesponse,
      chatSessionId: socket.id,
    });
    console.log("Bot message to be saved:", botMessage);
    await botMessage.save();
    socket.emit("chat_message", airesponse);
  } catch (error) {
    console.log("error in handling chat message", error);
  }
};
