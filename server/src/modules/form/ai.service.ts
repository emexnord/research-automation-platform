import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import configuration from 'src/config';
import { GeneratedQuestion } from './entities/question.type';
import { number } from 'zod';
import { MOCK_AI_RESPONSE } from 'src/constants';

const config = configuration();

@Injectable()
export class GeminiService {
  async generateQuestions(
    context: string,
    numberOfQuestions: number,
  ): Promise<GeneratedQuestion[]> {
    const apiKey = "AIzaSyC7XiQK7lgf-UDpKmoCL5Tg9-TTuq5amLY";

    if (!apiKey) return MOCK_AI_RESPONSE;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `
        Generate ${numberOfQuestions} engaging survey questions about "${context}". Mix different types:
        - SHORT_PARAGRAPH
        - PARAGRAPH
        - MULTIPLE_CHOICE (with 3-4 options)
        - CHECKBOXES (with 3-5 options)
        - DROPDOWN (with 3-4 options)
        - IMAGE_UPLOAD (when relevant)

        Return JSON like:
        [
        {
            "question": "Your question?",
            "type": "MULTIPLE_CHOICE",
            "options": ["A", "B", "C"],
            "required": true
        }
        ]
        Only return raw JSON without formatting or markdown.
    `;

    const chat = model.startChat({
      generationConfig: {
        temperature: 1,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        responseMimeType: 'text/plain',
      },
    });

    const result = await chat.sendMessage(prompt);
    const responseText = result.response
      .text()
      .replace(/```(json)?|```/g, '')
      .trim();

    try {
      const parsed: GeneratedQuestion[] = JSON.parse(responseText);
      const response = parsed.map((q, idx) => ({
        ...q,
        id: (idx + 1).toString(),
      }));
      return response;
    } catch (e) {
      console.error('Error parsing Gemini output:', e);
      console.log('Raw output:', responseText);
      throw new Error('Invalid AI output');
    }
  }
}
