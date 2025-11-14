import { GoogleGenAI, Type } from "@google/genai";
import { TripPreferences, Itinerary } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const itinerarySchema = {
  type: Type.OBJECT,
  properties: {
    trip_title: { type: Type.STRING, description: "Un título atractivo y descriptivo para el viaje." },
    total_estimated_cost: { type: Type.STRING, description: "El costo total estimado para todo el viaje, en USD. Incluye el símbolo de la moneda." },
    summary: { type: Type.STRING, description: "Un resumen breve y atractivo del viaje en general." },
    daily_plans: {
      type: Type.ARRAY,
      description: "Un plan día por día para el viaje.",
      items: {
        type: Type.OBJECT,
        properties: {
          day: { type: Type.INTEGER, description: "El número del día del itinerario (por ejemplo, 1, 2, 3)." },
          theme: { type: Type.STRING, description: "Un tema para las actividades del día, como 'Inmersión Cultural' o 'Exploración Costera'." },
          activities: {
            type: Type.ARRAY,
            description: "Una lista de actividades para el día.",
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "El nombre de la actividad o lugar." },
                description: { type: Type.STRING, description: "Una descripción detallada de la actividad, qué esperar y por qué se recomienda." },
                estimated_cost: { type: Type.STRING, description: "Costo estimado para esta actividad en USD. Puede ser un rango (ej: '$20-$30') o 'Gratis'." },
                justification: { type: Type.STRING, description: "Una explicación clara de por qué se eligió esta actividad específica, vinculándola directamente con los intereses y preferencias declarados por el usuario." },
              },
              required: ["title", "description", "estimated_cost", "justification"],
            },
          },
        },
        required: ["day", "theme", "activities"],
      },
    },
  },
  required: ["trip_title", "total_estimated_cost", "summary", "daily_plans"],
};

export async function generateItinerary(preferences: TripPreferences): Promise<{ itinerary: Itinerary, sources: any[] }> {
  // FIX: Added the JSON schema to the prompt and updated instructions for better model guidance, as responseSchema is not supported with googleSearch tool.
  const prompt = `
    Eres un agente de viajes experto y copiloto logístico llamado 'TripGenie'. Tu tarea es crear un itinerario de viaje detallado, personalizado, atractivo y factible basado en las preferencias del usuario. La respuesta DEBE ser en español.

    **INSTRUCCIONES CRÍTICAS:**
    1.  **Usa la Búsqueda de Google:** DEBES usar los resultados de la Búsqueda de Google proporcionados para asegurar que tus recomendaciones (restaurantes, sitios, actividades) estén actualizadas, sean relevantes y tengan buenas valoraciones.
    2.  **La Explicabilidad es Clave:** Para cada actividad recomendada, proporciona una 'justificación' clara y concisa que explique exactamente POR QUÉ se alinea con los intereses específicos del usuario. Por ejemplo, si le gustan las actividades de 'Aire libre', explica cómo la caminata recomendada encaja en ese interés.
    3.  **Sé Coherente:** El itinerario debe ser lógico. Agrupa las actividades geográficamente para cada día para minimizar el tiempo de viaje. Asegúrate de que el ritmo sea realista y no apresurado.
    4.  **Sigue el Esquema:** Debes formatear tu respuesta como un objeto JSON válido que se adhiera estrictamente al siguiente esquema JSON. No te desvíes. No incluyas ninguna explicación o texto adicional fuera del objeto JSON.

    **Esquema JSON:**
    \`\`\`json
    ${JSON.stringify(itinerarySchema, null, 2)}
    \`\`\`

    **Preferencias de Viaje del Usuario:**
    -   **Destino:** ${preferences.destination}
    -   **Duración del Viaje:** ${preferences.duration} días
    -   **Presupuesto Total:** Aproximadamente $${preferences.budget} USD
    -   **Intereses Principales:** ${preferences.interests.join(', ')}
    -   **Notas Adicionales y Restricciones:** ${preferences.specialRequirements || 'Ninguna'}

    Ahora, genera el itinerario de viaje completo y personalizado en español basado en estos requisitos.
    `;
    
    try {
        // FIX: Removed responseMimeType and responseSchema from config as they are not supported when using the googleSearch tool.
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });
        
        // FIX: Added logic to extract JSON from markdown code blocks, as the model may wrap the JSON response.
        let jsonText = response.text.trim();
        const match = jsonText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        if (match && match[1]) {
            jsonText = match[1];
        }
        
        const itinerary: Itinerary = JSON.parse(jsonText);
        const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

        return { itinerary, sources };
    } catch (error) {
        console.error("Error al generar el itinerario:", error);
        throw new Error("No se pudo analizar el itinerario de la IA. Es posible que el modelo haya devuelto un formato no válido. Por favor, intenta ajustar tus entradas.");
    }
}