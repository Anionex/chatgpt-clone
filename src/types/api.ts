export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface ChatCompletionResponse {
  id: string;
  choices: Array<{
    message: {
      content: string;
      role: 'assistant';
    };
  }>;
}