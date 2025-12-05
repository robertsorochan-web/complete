import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { chatWithAkofa } from '../../services/auth';

const Chat = ({ assessmentData, purpose = 'personal' }) => {
  const getWelcomeMessage = () => {
    const messages = {
      personal: 'Hello! I am Akↄfa, your personal guide. I understand your life based on the scores you give. Ask me anything - about what is holding you back, how to improve, or what to do first. I am here to help you see clearly.',
      team: 'Hello! I am Akↄfa, your team advisor. Based on your team assessment, I can help you understand what is affecting team performance. Ask me about team challenges, how to build trust, or what to fix first.',
      business: 'Hello! I am Akↄfa, your business advisor. Based on your business assessment, I can help you see what is blocking growth. Ask me about strategy, operations, or how to scale better.',
      policy: 'Hello! I am Akↄfa, your systems advisor. Based on your assessment, I can help you understand how different parts of the system connect. Ask me about interventions, policy impacts, or practical solutions.'
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something happen. Try again?' }]);
    } finally {
      setLoading(false);
    }
  };

  const placeholders = {
    personal: 'What is on your mind? Ask me...',
    team: 'Ask about your team...',
    business: 'Ask about your business...',
    policy: 'Ask about the system...'
  };

  const quickPrompts = {
    personal: [
      'What is holding me back most?',
      'How can I improve my sleep?',
      'Give me action steps for this week'
    ],
    team: [
      'What is affecting team performance?',
      'How can we build more trust?',
      'Give me team action steps'
    ],
    business: [
      'What is blocking our growth?',
      'How can we improve operations?',
      'Give me business action steps'
    ],
    policy: [
      'Where should we start?',
      'How do these areas connect?',
      'Give me practical recommendations'
    ]
  };

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="chat-container h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 p-4 border-b border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-white">Talk to Akↄfa</div>
            <div className="text-xs text-gray-400">Your personal guide based on your scores</div>
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 1 && (
        <div className="p-4 bg-slate-800/50">
          <p className="text-sm text-gray-400 mb-3">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {(quickPrompts[purpose] || quickPrompts.personal).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleQuickPrompt(prompt)}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm text-gray-300 hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-2xl ${
              msg.role === 'user'
                ? 'bg-purple-600 text-white rounded-br-md'
                : 'bg-slate-700 text-gray-100 rounded-bl-md'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-700 p-4 bg-slate-800/50">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[purpose] || placeholders.personal}
            className="flex-1 px-4 py-3 bg-slate-700 rounded-xl border border-slate-600 focus:border-purple-500 outline-none transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-xl disabled:opacity-50 transition"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Akↄfa understands your scores and gives advice that fits your situation
        </p>
      </div>
    </div>
  );
};

export default Chat;
