import { Message } from '../types/chat';
import { API_CONFIG } from '../config/api';
import { streamResponse } from '../utils/stream';
import type { ChatCompletionResponse } from '../types/api';

export async function sendMessage(messages: Message[], onChunk?: (chunk: string) => void) {
  try {
    const response = await fetch(`${API_CONFIG.baseUrl}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`,
        'Accept': 'text/event-stream',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: 0.7,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to send message');
    }

    let fullContent = '';
    for await (const chunk of streamResponse(response)) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        fullContent += content;
        onChunk?.(content);
      }
    }

    return {
      message: {
        id: Date.now().toString(),
        content: fullContent,
        role: 'assistant',
        timestamp: new Date(),
      }
    };
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unexpected error occurred');
  }
}