import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const messageSchema = z.object({
  messages: z.array(z.object({
    content: z.string(),
    role: z.enum(['user', 'assistant']),
    id: z.string(),
    timestamp: z.string().or(z.date())
  }))
});

export function validateMessage(req: Request, res: Response, next: NextFunction) {
  try {
    messageSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid message format' });
  }
}