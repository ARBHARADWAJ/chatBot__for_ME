// import dotenv from "dotenv";
// dotenv.config(); // Load environment variables from .env file
// const apiKey = process.env.GOOGLE_API_KEY;
// import { GoogleGenAI } from "@google/genai";

// // Add your API key here
// const ai = new GoogleGenAI(process.env.GOOGLE_API_KEY)

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: "Explain how AI works in a few words",
    
//   });
//   console.log(response.text);
// }

// await main();
// await main();
console.log("========================================================================");

import { GoogleGenerativeAI } from "@google/generative-ai";

// Fix 1: Load environment variables at the very top.

// Now it's safe to read the API key.
const modelName = "gemini-2.5-flash";
 // Using a stable, recommended model

const genAI = new GoogleGenerativeAI("AIzaSyDn8U1ZS70eUdj7vUgo3qqFnCfmUqTmM5E");

async function generateResponse(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;

    const text = response.text();
    return text;
  } catch (error) {
    console.error("AI Error:", error.message);
    return "An error occurred while generating the response.";
  }
}

// Fix 3: Handle the async function with .then() or await.
generateResponse("Tell me about yourself, like your model name and capabilities. in 20 words and what is different between version 2.0 and version 2.5 in google gemini flash")
  .then(response => console.log(response));
