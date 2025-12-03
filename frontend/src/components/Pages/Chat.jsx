import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { chatWithAkofa } from '../../services/auth';

const Chat = ({ assessmentData, purpose = 'personal' }) => {
  const getWelcomeMessage = () => {
    const messages = {
      personal: 'Hi! I\'m here to help you understand your assessment and create a plan to achieve your goals. Ask me anything about your 5 life areas, what they mean, or how to improve them.',
      team: 'Hi! I\'m here to help you understand your team assessment and develop strategies to improve team performance. Ask me about team dynamics, collaboration, or how to address specific challenges.',
      business: 'Hi! I\'m here to help you understand your business assessment and develop strategies for organizational growth. Ask me about business strategy, operations, or how to address specific challenges.',
      policy: 'Hi! I\'m here to help you understand your system assessment and develop evidence-based recommendations. Ask me about policy implications, systemic interventions, or research insights.'
    };
    return messages[purpose] || messages.personal;
  };

  const [messages, setMessages] = useState([
    { role: 'assistant', content: getWelcomeMessage() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setMessages([{ role: 'assistant', content: getWelcomeMessage() }]);
  }, [purpose]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const response = await chatWithAkofa(userMessage, assessmentData, purpose, messages);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I had trouble processing that. Try again?' }]);
    } finally {
      setLoading(false);
    }
  };

  const placeholders = {
    personal: 'Ask anything about your goals...',
    team: 'Ask anything about your team...',
    business: 'Ask anything about your organization...',
    policy: 'Ask anything about the system or policy...'
  };

  return (
    <div className="chat-container h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 text-gray-100'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      <div className="border-t border-slate-700 p-6">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[purpose] || placeholders.personal}
            className="flex-1 px-4 py-3 bg-slate-700 rounded-lg border border-slate-600 focus:border-purple-500 outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
