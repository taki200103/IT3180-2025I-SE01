import React, { useState } from 'react';
import { MessageSquare, X, Minimize2 } from 'lucide-react';
import ChatAIView from './ChatAIView';

export default function FloatingChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-4 w-14 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-[9999] hover:scale-110"
          style={{ zIndex: 9999 }}
          aria-label="Mở trợ lý AI"
          title="Trợ lý AI"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-4 z-[9999] transition-all duration-300 ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[90vw] sm:w-[420px] h-[80vh] sm:h-[600px] max-h-[600px]'
          }`}
          style={{ zIndex: 9999 }}
        >
          <div className="bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Trợ lý AI</h3>
                  {!isMinimized && (
                    <p className="text-xs text-white/80">Powered by Groq</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setIsMinimized(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  title="Đóng"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Content */}
            {!isMinimized && (
              <div className="flex-1 overflow-hidden flex flex-col">
                <ChatAIView hideHeader={true} />
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

