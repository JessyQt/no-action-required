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
      Actúa como un experto en accesibilidad web y analiza los siguientes resultados de un escaneo:
      
      Puntuación: ${scanResult.score}/100
      
      Problemas encontrados:
      ${scanResult.issues.map((issue: any) => 
        `- ${issue.title} (Severidad: ${issue.severity})`
      ).join('\n')}
      
      Por favor, proporciona:
      1. Una explicación clara y concisa del estado general de accesibilidad
      2. Los principales problemas encontrados y su impacto en usuarios reales
      3. Recomendaciones prioritarias para mejorar
      
      Responde en español, usando un lenguaje claro y fácil de entender.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error al interpretar resultados con Gemini:', error);
    return null;
  }
}