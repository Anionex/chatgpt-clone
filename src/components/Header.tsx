import React from 'react';
import { Bot } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
        <Bot className="w-6 h-6 text-green-600" />
        <h1 className="text-xl font-semibold">AI Chat Interface</h1>
      </div>
    </header>
  );
}