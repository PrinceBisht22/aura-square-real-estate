import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from './icons.jsx';
import { chatWithAI } from '../utils/api.js';

const ChatWidget = () => {
  const [isChatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Aura Square assistant. I can help you search properties, calculate loans, or answer questions. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const suggestions = [
    { text: 'Search properties', action: () => navigate('/buy') },
    { text: 'Find EMI calculator', action: () => navigate('/tools/emi') },
    { text: 'Contact support', action: () => navigate('/contact') },
  ];

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const conversationHistory = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      }));

      const response = await chatWithAI(userMessage, conversationHistory);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: "I'm sorry, I encountered an error. Please try again or contact our support team." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestion = (suggestion) => {
    if (suggestion.action) {
      suggestion.action();
      setChatOpen(false);
    } else {
      setInput(suggestion.text);
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-navy to-indigo text-white p-4 rounded-full shadow-2xl z-[1500] transition-transform hover:scale-110 active:scale-95"
        aria-label="Open chat"
      >
        {isChatOpen ? <ICONS.X className="h-6 w-6" /> : <ICONS.MessageSquare className="h-6 w-6" />}
      </button>
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-white rounded-2xl shadow-2xl z-[1500] flex flex-col transition-all duration-300 border border-gray-100">
          <div className="bg-gradient-to-r from-navy to-indigo text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg">Aura Square Assistant</h3>
              <p className="text-xs opacity-90">We're here to help!</p>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white/80 hover:text-white transition"
              aria-label="Close chat"
            >
              <ICONS.X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-grow p-4 overflow-y-auto text-sm space-y-3 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-navy to-indigo text-white'
                      : 'bg-white text-navy border border-gray-200'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-navy border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-2">
                  <ICONS.Loader className="h-4 w-4 animate-spin" />
                  <span>Thinking...</span>
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Quick suggestions:</p>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestion(suggestion)}
                    className="block w-full text-left bg-white border border-gray-200 hover:border-navy hover:bg-navy/5 rounded-xl px-4 py-2 text-sm transition"
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSend} className="p-3 border-t bg-white rounded-b-2xl flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="bg-gradient-to-r from-navy to-indigo text-white p-2 rounded-xl hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Send message"
            >
              <ICONS.Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
