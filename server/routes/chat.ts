import { Router } from 'express';
import { createChatCompletion } from '../controllers/chat.js';
import { validateMessage } from '../middleware/validation.js';

export const router = Router();

router.post('/completion', validateMessage, createChatCompletion);