import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const modelName = "gemini-2.5-flash";
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: modelName });

async function generateResponse(prompt) {
  if (!apiKey) {
    console.error("GOOGLE_API_KEY is not set in environment variables.");
    return "API key missing.";
  }

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "An error occurred while generating the response.";
  }
}

export default generateResponse;
