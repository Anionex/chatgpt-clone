import { useState, useCallback, useEffect } from 'react';
import { Message, ChatSession, ChatState } from '../types/chat';
import { sendMessage } from '../services/api';
import { nanoid } from 'nanoid';

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null,
};

export function useChat() {
  const [state, setState] = useState<ChatState>(() => {
    const saved = localStorage.getItem('chatState');
    return saved ? JSON.parse(saved) : initialState;
  });

  const [streamingContent, setStreamingContent] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('chatState', JSON.stringify(state));
  }, [state]);

  const getCurrentSession = useCallback(() => {
    return state.sessions.find(s => s.id === state.currentSessionId);
  }, [state.currentSessionId, state.sessions]);

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: nanoid(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setState(prev => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
      currentSessionId: newSession.id,
    }));

    return newSession;
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return;
    
    const session = getCurrentSession() || createNewSession();
    const userMessage: Message = {
      id: nanoid(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      sessions: prev.sessions.map(s =>
        s.id === session.id
          ? {
              ...s,
              messages: [...s.messages, userMessage],
              updatedAt: new Date(),
              title: s.messages.length === 0 ? content.slice(0, 30) + '...' : s.title,
            }
          : s
      ),
      isLoading: true,
      error: null,
    }));

    setStreamingContent('');

    try {
      const placeholderId = nanoid();
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.map(s =>
          s.id === session.id
            ? {
                ...s,
                messages: [...s.messages, {
                  id: placeholderId,
                  content: '',
                  role: 'assistant',
                  timestamp: new Date(),
                }],
              }
            : s
        ),
      }));

      // Start streaming
      const { message: aiMessage } = await sendMessage([...session.messages, userMessage], (chunk) => {
        setStreamingContent(prev => prev + chunk);
        
        // Update the placeholder message with current content
        setState(prev => ({
          ...prev,
          sessions: prev.sessions.map(s =>
            s.id === session.id
              ? {
                  ...s,
                  messages: s.messages.map(m =>
                    m.id === placeholderId
                      ? { ...m, content: streamingContent + chunk }
                      : m
                  ),
                }
              : s
          ),
        }));
      });

      // Update final message
      setState(prev => ({
        ...prev,
        isLoading: false,
        sessions: prev.sessions.map(s =>
          s.id === session.id
            ? {
                ...s,
                messages: s.messages.map(m =>
                  m.id === placeholderId
                    ? { ...aiMessage, id: placeholderId }
                    : m
                ),
              }
            : s
        ),
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to get AI response. Please check your connection and try again.',
      }));
    }
  }, [getCurrentSession, createNewSession, streamingContent]);

  return {
    sessions: state.sessions,
    currentSession: getCurrentSession(),
    isLoading: state.isLoading,
    error: state.error,
    streamingContent,
    sendMessage: handleSendMessage,
    createNewSession,
    switchSession: useCallback((sessionId: string) => {
      setState(prev => ({ ...prev, currentSessionId: sessionId }));
    }, []),
    deleteSession: useCallback((sessionId: string) => {
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.filter(s => s.id !== sessionId),
        currentSessionId: sessionId === prev.currentSessionId
          ? (prev.sessions[0]?.id || null)
          : prev.currentSessionId,
      }));
    }, []),
    updateSessionTitle: useCallback((sessionId: string, title: string) => {
      setState(prev => ({
        ...prev,
        sessions: prev.sessions.map(s => 
          s.id === sessionId
            ? { ...s, title, updatedAt: new Date() }
            : s
        ),
      }));
    }, []),
  };
}