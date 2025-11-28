import { GoogleGenerativeAI } from "@google/generative-ai";
import { OnboardingData } from '../app/onboard/types';

const getAiClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY; 
  if (!apiKey) {
    console.error("NEXT_PUBLIC_GEMINI_API_KEY environment variable is not set.");
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

export const analyzeProfile = async (data: OnboardingData) => {
  const ai = getAiClient();
  if (!ai) {
    console.warn("API Client not initialized due to missing API Key.");
    return null;
  }

  const prompt = `
    Tu es "JC, le Catalyseur de Clarté". Ton expertise est d'aider les entrepreneurs multipotentiels (zèbres, HP) à structurer leur chaos créatif.
    
    Analyse ce profil client pour préparer ton premier appel ou valider leur onboarding.

    Données du client :
    Nom: ${data.clientName}
    Lutte principale: ${data.mainStruggle}
    Déclencheur: ${data.triggerEvent}
    Vision désirée: ${data.whys.level5}
    
    Profondeur du problème (7 Niveaux):
    1. ${data.whys.level1}
    3. ${data.whys.level3}
    7. (Vérité): ${data.whys.level7}
    
    Offre visée: ${data.selectedOfferInterest}
    Budget/Engagement: ${data.budgetCommitment}
    
    Génère un JSON strict :
    - archetype: Quel type de multipotentiel est-ce ? (ex: "Le Série-Entrepreneur dispersé", "Le Visionnaire paralysé", "L'Artiste perfectionniste").
    - strategy: 3 points clés pour débloquer sa situation en utilisant ma méthode (Silence intérieur, Concentration laser, Confiance).
    - personalizedMessage: Un message court, percutant et empathique pour confirmer que je peux l'aider, en utilisant le ton de JC (bienveillant mais direct).
  `;

  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // Extract the JSON string from the markdown code block
    const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      return JSON.parse(jsonMatch[1]);
    } else {
      // Fallback for cases where the response might be raw JSON
      return JSON.parse(text);
    }
  } catch (error) {
    console.error("Gemini analysis failed", error);
    throw error;
  }
};
