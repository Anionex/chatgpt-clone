import React from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { WelcomeMessage } from './components/WelcomeMessage';
import { ErrorMessage } from './components/ErrorMessage';
import { useChat } from './hooks/useChat';
import { SidebarProvider } from './contexts/SidebarContext';

function App() {
  const {
    sessions,
    currentSession,
    isLoading,
    error,
    streamingContent,
    sendMessage,
    createNewSession,
    switchSession,
    deleteSession,
    updateSessionTitle,
  } = useChat();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-white">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSession?.id || null}
          onNewChat={createNewSession}
          onSwitchSession={switchSession}
          onDeleteSession={deleteSession}
          onUpdateSessionTitle={updateSessionTitle}
        />
        
        <div className="flex-1 flex flex-col">
          <Header />

          <div className="flex-1 overflow-y-auto">
            {error && <ErrorMessage message={error} />}
            
            {!currentSession || currentSession.messages.length === 0 ? (
              <WelcomeMessage />
            ) : (
              currentSession.messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isStreaming={isLoading && index === currentSession.messages.length - 1}
                  streamContent={streamingContent}
                />
              ))
            )}
          </div>

          <ChatInput onSend={sendMessage} disabled={isLoading} />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default App;