declare module "../config/genai" {
  import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";

  export const genAI: GoogleGenerativeAI;
  export function getModel(modelName?: string): GenerativeModel;
}
