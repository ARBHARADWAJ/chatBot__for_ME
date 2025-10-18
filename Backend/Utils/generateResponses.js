import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { exportMessages, exportNoOfMessages } from "../Utils/ChatUtils.js";
import { apikeyforgoogleapi } from "../server.js";

const modelName = "gemini-2.5-flash";


async function generateResponse(sessionId, text) {
  console.log("came to this function");

  const apiKey = apikeyforgoogleapi();
  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set in environment variables.");
    return "API key missing.";
  }
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: `You are an assistant that answers concisely and helpfully.
- Tone: friendly, simple language, avoid jargon.
- Length: aim for <= 100 words. If asked for details, provide a short summary (<=100 words) and offer to expand.
- Clarity: prefer short sentences and examples.
- Context: always consider the recent conversation history and the latest user message. If user asks about recent/updated data, prefer the newest information in history.
- Format: return plain text. If the user asks for structured output, return valid JSON with keys: { answer: string, citations?: string[] }.
- Do not invent facts. If unsure, say "I don't know" and/or provide steps to find out.`,
  });

  try {
    let noOfMessages = await exportNoOfMessages(sessionId);
    let messages = [];

    if (noOfMessages > 15) {
      noOfMessages = 15;
    }
    // Fetch the old messages
    messages = await exportMessages(sessionId, noOfMessages ?? 1);

    // Format the old messages from the database
    const formattedHistory = messages.map((msg) => ({
      role: msg.role.toLowerCase() === "user" ? "user" : "model",
      parts: [{ text: msg.message }],
    }));

    // ✅ FIX: Create a correctly formatted object for the NEW message that was just sent
    const newUserMessage = {
      role: "user",
      parts: [{ text: text }], // Use the 'text' parameter here
    };

    // ✅ FIX: Combine the old history and the new message into one array
    const fullContent = [...formattedHistory, newUserMessage];

    // Send the complete conversation history to the AI
    const result = await model.generateContent({ contents: fullContent });
    const response = result.response;
    const responseText = response.text(); // Renamed to avoid conflict with the 'text' parameter
    return responseText;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "An error occurred while generating the response.";
  }
}
// generateResponse("Hello, how are you?").then((res) => console.log(res));

export default generateResponse;



// async function generateResponse(sessionId, text) {
//   console.log("came to this function");

//   const apiKey = "AIzaSyDn8U1ZS70eUdj7vUgo3qqFnCfmUqTmM5E";
//   console.log("API KEY:", apiKey); // Debug: print API key
//   if (!apiKey) {
//     console.error("GOOGLE_API_KEY is not set in environment variables.");
//     return "API key missing.";
//   }
//   const genAI = new GoogleGenerativeAI(apiKey);
//   const model = genAI.getGenerativeModel({ model: modelName });

//   try {
//     let noOfMessages = await exportNoOfMessages(sessionId);
//     if (noOfMessages > 15) {
//       noOfMessages = 15;
//     }

//     // 1. Fetch the message history (already in chronological order from exportMessages)
//     const messageHistory = await exportMessages(sessionId, noOfMessages);

//     // If there's no history, we can't generate a response based on it.
//     if (messageHistory.length === 0) {
//       return "I'm ready to chat! What's on your mind?";
//     }

//     // 2. ✅ FIX: The last message in the array is the user's NEW prompt.
//     // We separate it from the rest of the history.
//     const lastMessage = messageHistory.pop();

//     // 3. ✅ FIX: Format the OLD messages for the chat history.
//     const historyForAI = messageHistory.map((msg) => ({
//       role: msg.role.toLowerCase() === "user" ? "user" : "model",
//       parts: [{ text: msg.message }],
//     }));

//     // 4. ✅ FIX: Use the `startChat` method, which is built for conversations.
//     const chat = model.startChat({
//       history: historyForAI,
//     });

//     // 5. ✅ FIX: Send only the new message's text to get a response.
//     const result = await chat.sendMessage(lastMessage.message);
//     const response = result.response;
//     return response.text(); // return "this is the text"
//   } catch (error) {
//     console.error("AI Error:", error.message);
//     return "An error occurred while generating the response.";
//   }
// }
