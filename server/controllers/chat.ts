import { Request, Response, NextFunction } from 'express';
import { OpenAI } from 'openai';
import { ChatMessage } from '../types/chat.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function createChatCompletion(
  req: Request<{}, {}, { messages: ChatMessage[] }>,
  res: Response,
  next: NextFunction
) {
  try {
    const { messages } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      temperature: 0.7,
    });

    const reply = completion.choices[0].message;

    res.json({
      message: {
        id: Date.now().toString(),
        content: reply.content,
        role: 'assistant',
        timestamp: new Date()
      }
    });
  } catch (error) {
    next(error);
  }
}