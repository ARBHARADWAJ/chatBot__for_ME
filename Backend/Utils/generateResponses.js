import { GoogleGenerativeAI } from "@google/generative-ai";
import { exportMessages, exportNoOfMessages } from "../Utils/ChatUtils.js";
import { apikeyforgoogleapi } from "../server.js";
import { modified_Message } from "./PromtpUtils.js"; 

const modelName = "gemini-2.0-flash";

const BASE_SYSTEM_INSTRUCTION = `You are an assistant that answers concisely and helpfully.
- Tone: friendly, simple language, avoid jargon.
- Length:  aim for <= 100 words if user not requested any thing,if he specified ,otherwise air for >100 words.
- Context: always consider the recent conversation history.
- Format: return plain text unless JSON is requested then provide with valid format so that the front end can fetch and give beautifully to the user.
- Do not invent facts.
-Always keep it in consideration that these are responses are for Indians, for this project ,so kindly provide with neat answers in indian tone and details.
-If the context is large topic ,take some time to fetch all the data and provide a detailed answer.waiting is some times good.`
;

async function generateResponse(sessionId, text, mode, subdivision) {
  const apiKey = apikeyforgoogleapi();
  if (!apiKey) return "API key missing.";

  const genAI = new GoogleGenerativeAI(apiKey);
console.log(text,mode,subdivision);

  try {
    // 1. Fetch History (THE MEMORY)
    let noOfMessages = await exportNoOfMessages(sessionId);
    const MAX_HISTORY = 15;
    const messagesToFetch = Math.min(noOfMessages, MAX_HISTORY) || 1;
    
    // Fetch raw messages from DB
    let messages = await exportMessages(sessionId, messagesToFetch);

    // 2. Format History (CRITICAL FOR MEMORY)
    // The API requires this exact structure: { role: string, parts: [{ text: string }] }
    let formattedHistory = messages.map((msg) => ({
      role: msg.role.toLowerCase() === "user" ? "user" : "model",
      parts: [{ text: typeof msg.message === "string" ? msg.message : String(msg.message) }],
    }));
    formattedHistory = formattedHistory.reverse(); // Ensure chronological order
    // 3. Generate the Custom Instructions (Mode & Subdivision)
    const specificInstruction = modified_Message(text, mode, subdivision);

    // 4. Combine Base + Specific Instructions
    const finalSystemInstruction = specificInstruction + "\n" + BASE_SYSTEM_INSTRUCTION;
    // console.log(finalSystemInstruction);
    
    // 5. Initialize Model
    // ✅ FIX: Use 'finalSystemInstruction' here. You were using 'BASE_SYSTEM_INSTRUCTION' before.
    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: finalSystemInstruction, 
    });

    // 6. Create the New User Message
    // This is just the raw text. The AI will look at 'formattedHistory' for context
    // and 'finalSystemInstruction' for how to behave.
    const newUserMessage = {
      role: "user",
      parts: [{ text: text }], 
    };
    // console.log(newUserMessage);
  

    // 7. Merge History + New Message
    const fullContent = [...formattedHistory, newUserMessage];
    //to log all the fullcontent array
    
    // console.log(fullContent.map(item => item.parts.map(part => part.text).join(' ')).join('\n---\n'));
    // Debugging: Ensure memory is being sent
    // console.log(`Sending ${formattedHistory.length} past messages as memory.`);

    const result = await model.generateContent({ contents: fullContent });
    const rawText = result.response.text();

    try {
      const jsonResponse = JSON.parse(rawText);
      if (jsonResponse && jsonResponse.answer) return jsonResponse.answer;
      return rawText;
    } catch (e) {
      return rawText;
    }

  } catch (error) {
    console.error("AI Error:", error.message);
    return "An error occurred.";
  }
}

export default generateResponse;