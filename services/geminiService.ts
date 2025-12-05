import { GoogleGenAI } from "@google/genai";
import { KPIData, MotivationData, SpendData } from "../types";

// Note: In a real environment, the API key must be in process.env.API_KEY
// The system prompt guarantees this is available.

const getAiClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateDashboardInsights = async (
  kpis: KPIData[],
  motivations: MotivationData[],
  spending: SpendData[],
  eventName: string
): Promise<string> => {
  const ai = getAiClient();
  
  const prompt = `
    Atue como um Especialista em Inteligência de Dados de Turismo.
    Analise os seguintes dados do evento "${eventName}" em Cuiabá:

    KPIs:
    ${kpis.map(k => `- ${k.label}: ${k.value}`).join('\n')}

    Motivação da Viagem:
    ${motivations.map(m => `- ${m.reason}: ${m.percentage}%`).join('\n')}

    Distribuição de Gastos:
    ${spending.map(s => `- ${s.category}: ${s.amount}`).join('\n')}

    Forneça um resumo executivo curto (máximo 3 parágrafos) destacando:
    1. O perfil econômico do turista.
    2. A eficácia do evento em atrair turismo dedicado.
    3. Uma recomendação estratégica para a próxima edição.

    Use formatação Markdown simples. Seja profissional e direto.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Error generating insights:", error);
    return "Erro ao conectar com a IA para gerar insights.";
  }
};