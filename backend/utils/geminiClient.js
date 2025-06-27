import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.error('GEMINI_API_KEY is not set in the .env file.');
  process.exit(1); // Exit if API key is missing
}

const genAI = new GoogleGenerativeAI(API_KEY);

// Function to get a concise response from Gemini
export const getConciseGeminiResponse = async (promptText) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Use gemini-2.5-flash for efficiency

    // IMPORTANT: Engineering the prompt for a shorter reply
    const concisePrompt = `Please provide a very short and concise answer (max 2-3 sentences or a brief bullet list if applicable) to the following: "${promptText}"`;

    const result = await model.generateContent(concisePrompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error communicating with Gemini API:", error);
    throw new Error("Failed to get response from Gemini API.");
  }
};

export const getGeminiChatResponse = async (chatHistory, newMessage) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Or 'gemini-2.5-pro' for more complex chats
    const chat = model.startChat({
      history: chatHistory.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model', // Ensure roles are 'user' or 'model'
        parts: [{ text: msg.text }]
      }))
    });

    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error in Gemini chat:", error);
    throw new Error("Failed to get chat response from Gemini API.");
  }
};