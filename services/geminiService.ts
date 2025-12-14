import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const askAiTutor = async (question: string, context: string): Promise<string> => {
  if (!apiKey) {
    return "AI Tutor is offline (Missing API Key).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: The student is learning Java. They are currently looking at this content: "${context}".
      
      User Question: "${question}"
      
      Instruction: You are a friendly, futuristic AI tutor named "CyberSensei". Keep answers concise (under 3 sentences if possible), encouraging, and strictly related to Java programming. Use a slight sci-fi/tech tone.`,
    });
    
    return response.text || "I couldn't process that query. Try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection to the neural network failed. Please try again later.";
  }
};