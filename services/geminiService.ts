import { GoogleGenAI } from "@google/genai";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please set process.env.API_KEY");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const enhanceText = async (text: string, context: string): Promise<string> => {
  if (!text) return "";
  
  const ai = getAIClient();
  const prompt = `
    Sen profesyonel bir CV danışmanısın (Vico uzmanı).
    Aşağıdaki metni (${context}) daha profesyonel, etkileyici ve kısa bir hale getir. 
    İmla hatalarını düzelt. Türkçe yanıt ver.
    Sadece revize edilmiş metni döndür, başka açıklama yapma.
    
    Metin: "${text}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Gemini text enhancement failed:", error);
    throw error;
  }
};

export const editProfileImage = async (base64Image: string, instruction: string): Promise<string> => {
  const ai = getAIClient();
  
  // Clean base64 string if it contains metadata
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: 'image/jpeg', // Assuming jpeg/png for simplicity, works for most
            },
          },
          {
            text: `Edit this profile picture based on the following instruction: ${instruction}. Ensure the face remains recognizable but apply the requested style or edit. Return only the image.`
          },
        ],
      },
    });

    // Check for inlineData in response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
         return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini image editing failed:", error);
    throw error;
  }
};

export const translateCV = async (data: any): Promise<any> => {
  const ai = getAIClient();
  
  const prompt = `
    You are a professional CV translator and career consultant.
    Translate the following JSON CV data from Turkish to professional Business English.
    
    Rules:
    1. Keep the JSON structure exactly the same. Keys must not change.
    2. Translate "summary", "description", "title", "degree", "name" (for skills/interests), "level" to English.
    3. In the "customLinks" array, translate the "label" property (e.g. "Kişisel Blog" -> "Personal Blog"), but do NOT translate the "url".
    4. Do NOT translate proper names of People, specific Turkish Universities (unless a common English name exists), or specific street addresses.
    5. For "startDate" and "endDate", if it says "Halen" or "Devam" or "Hâlen", translate to "Present".
    6. Ensure the tone is professional and suitable for a Global Talent application.
    7. Return ONLY the JSON string, no code blocks or markdown.

    Input JSON:
    ${JSON.stringify(data)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    const text = response.text || "{}";
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini CV translation failed:", error);
    throw error;
  }
};