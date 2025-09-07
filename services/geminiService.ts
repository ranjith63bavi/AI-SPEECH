
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const transcribeAudio = async (base64Audio: string, mimeType: string, languageName: string): Promise<string> => {
    try {
        const textPart = {
            text: `Please transcribe the following audio. The spoken language is ${languageName}.`,
        };

        const audioPart = {
            inlineData: {
                data: base64Audio,
                mimeType: mimeType,
            },
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: { parts: [textPart, audioPart] },
        });

        const transcription = response.text;
        if (!transcription) {
            throw new Error('The API returned an empty transcription.');
        }

        return transcription;
    } catch (error) {
        console.error('Error calling Gemini API:', error);
        if (error instanceof Error) {
            throw new Error(`Failed to transcribe audio: ${error.message}`);
        }
        throw new Error('An unknown error occurred while communicating with the API.');
    }
};
