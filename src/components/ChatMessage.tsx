import React, { useEffect, useRef } from 'react';
import { UserCircle, Bot } from 'lucide-react';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  isStreaming?: boolean;
  streamContent?: string;
}

export function ChatMessage({ message, isStreaming, streamContent }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) {
      messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isStreaming, streamContent]);

  return (
    <div className={`py-8 ${isUser ? 'bg-white' : 'bg-gray-50'}`}>
      <div className="max-w-3xl mx-auto flex gap-6 px-4">
        <div className="w-8 h-8 flex-shrink-0">
          {isUser ? (
            <UserCircle className="w-8 h-8 text-gray-600" />
          ) : (
            <Bot className="w-8 h-8 text-green-600" />
          )}
        </div>
        <div className="flex-1 space-y-2">
          <p className="font-medium text-sm">
            {isUser ? 'You' : 'Assistant'}
          </p>
          <div className="prose prose-slate max-w-none">
            {isStreaming ? streamContent : message.content}
          </div>
          <div ref={messageEndRef} />
        </div>
      </div>
    </div>
  );
}