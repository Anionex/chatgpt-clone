import React, { useState } from 'react';
import { MessageSquarePlus, Pencil, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ChatSession } from '../types/chat';
import { useSidebar } from '../contexts/SidebarContext';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSwitchSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onUpdateSessionTitle: (id: string, title: string) => void;
}

export function Sidebar({
  sessions,
  currentSessionId,
  onNewChat,
  onSwitchSession,
  onDeleteSession,
  onUpdateSessionTitle,
}: SidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { isExpanded, toggleSidebar } = useSidebar();

  const handleEditStart = (session: ChatSession) => {
    setEditingId(session.id);
    setEditTitle(session.title);
  };

  const handleEditSave = (id: string) => {
    if (editTitle.trim()) {
      onUpdateSessionTitle(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className={`relative bg-gray-50 h-screen flex flex-col border-r transition-all duration-300 ${
      isExpanded ? 'w-64' : 'w-0'
    }`}>
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-white border rounded-full p-1 shadow-md hover:shadow-lg transition-shadow"
      >
        {isExpanded ? (
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-600" />
        )}
      </button>

      <div className="p-4">
        <button
          onClick={onNewChat}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border hover:bg-gray-50 ${
            isExpanded ? 'w-full justify-start' : 'w-8 h-8 justify-center'
          }`}
        >
          <MessageSquarePlus className="w-4 h-4" />
          {isExpanded && 'New Chat'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sessions.map(session => (
          <div
            key={session.id}
            className={`group px-2 py-2 mx-2 rounded-lg cursor-pointer flex items-center justify-between ${
              session.id === currentSessionId ? 'bg-gray-200' : 'hover:bg-gray-100'
            }`}
            onClick={() => onSwitchSession(session.id)}
          >
            <div className="flex-1 min-w-0">
              {editingId === session.id ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="flex-1 px-2 py-1 text-sm border rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditSave(session.id);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(null);
                    }}
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <>
                      <span className="text-sm truncate">{session.title}</span>
                      <div className="hidden group-hover:flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStart(session);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Pencil className="w-3 h-3 text-gray-500" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteSession(session.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <Trash2 className="w-3 h-3 text-gray-500" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <MessageSquarePlus className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}