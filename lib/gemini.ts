import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn("GEMINI_API_KEY is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function generateCaption(prompt: string, imageUrl?: string) {
  try {
    if (imageUrl) {
      // Logic for image-based caption generation could go here
      // For now, we'll just use the text prompt
    }
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini AI error:", error);
    throw new Error("Failed to generate caption");
  }
}

export async function analyzeSentiment(text: string): Promise<"positive" | "negative" | "neutral"> {
  try {
    const prompt = `Analyze the sentiment of the following social media comment. 
    Respond with only one word: "positive", "negative", or "neutral".
    
    Comment: "${text}"`;
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const sentiment = response.text().toLowerCase().trim();
    
    if (sentiment.includes("positive")) return "positive";
    if (sentiment.includes("negative")) return "negative";
    return "neutral";
  } catch (error) {
    console.error("Gemini sentiment analysis error:", error);
    return "neutral";
  }
}

export async function generateAutoReply(comment: string, context?: string) {
  try {
    const prompt = `You are a helpful social media assistant. Generate a polite and engaging reply to the following comment.
    ${context ? `Use this additional context: ${context}` : ""}
    
    Comment: "${comment}"
    
    Reply should be concise and natural.`;
    
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Gemini auto-reply generation error:", error);
    throw new Error("Failed to generate auto-reply");
  }
}
