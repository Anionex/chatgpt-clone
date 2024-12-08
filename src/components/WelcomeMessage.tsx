import React from 'react';
import { Bot } from 'lucide-react';

export function WelcomeMessage() {
  return (
    <div className="h-full flex items-center justify-center text-center px-4">
      <div className="space-y-4">
        <Bot className="w-12 h-12 text-green-600 mx-auto" />
        <h2 className="text-2xl font-semibold">How can I help you today?</h2>
        <p className="text-gray-500 max-w-md">
          Ask me anything! I'm here to help with your questions and tasks.
        </p>
      </div>
    </div>
  );
}