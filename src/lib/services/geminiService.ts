import { GoogleGenerativeAI } from "@google/generative-ai";

export async function interpretAccessibilityResults(scanResult: any) {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
    if (!apiKey) {
      console.error('No se encontró la clave API de Gemini');
      return null;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analiza el siguiente problema de accesibilidad web y proporciona un análisis detallado:
      
      Problema: ${scanResult.issues[0].title}
      Severidad: ${scanResult.issues[0].severity}
      
      Por favor, proporciona:
      1. Impacto específico en usuarios con discapacidades
      2. Consecuencias prácticas para la experiencia del usuario
      3. Mejores prácticas para solucionar este problema
      
      Responde en español, usando un lenguaje claro y profesional. NO repitas la puntuación general ni el resumen del sitio, 
      céntrate solo en analizar este problema específico.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error al interpretar resultados con Gemini:', error);
    return null;
  }
}