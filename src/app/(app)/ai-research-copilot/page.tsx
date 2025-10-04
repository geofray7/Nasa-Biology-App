'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiResearchCoPilot } from '@/ai/flows/ai-research-copilot';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
};

const initialMessage: Message = {
  role: 'assistant',
  text: "Hello! I'm your NASA space assistant. Ask me anything about space exploration, astronomy, NASA missions, planets, rockets, or anything space-related!",
  time: getCurrentTime(),
};

export default function AiResearchCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      role: 'user',
      text: trimmedInput,
      time: getCurrentTime(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const response = await aiResearchCoPilot({ query: trimmedInput });
      const assistantMessage: Message = {
        role: 'assistant',
        text: response.answer,
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        text: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again in a moment.",
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full bg-gradient-to-br from-[#0a1128] to-[#1a243d] p-4">
      <div className="w-full max-w-5xl h-[90vh] bg-[#1a243d]/95 rounded-2xl shadow-2xl border border-[#2d3a5c] flex flex-col overflow-hidden">
        <div className="bg-[#0b3d91]/90 p-6 text-center border-b border-[#2d3a5c]">
          <h1 className="text-3xl font-bold mb-2 flex items-center justify-center gap-3">🚀 NASA Space Chat</h1>
          <p className="text-lg text-[#b8c2d6] max-w-2xl mx-auto leading-normal">Ask me anything about NASA, space exploration, astronomy, or space science</p>
        </div>

        <div ref={messagesEndRef} className="flex-1 p-6 overflow-y-auto space-y-5">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                'flex items-start gap-4 max-w-[85%]',
                msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              )}
            >
              <div
                className={cn(
                  'w-11 h-11 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xl',
                  msg.role === 'user' ? 'bg-[#fc3d21]' : 'bg-[#0b3d91]'
                )}
              >
                {msg.role === 'user' ? <User size={24} /> : <Bot size={24} />}
              </div>
              <div
                className={cn(
                  'bg-white/5 p-4 rounded-2xl backdrop-blur-md',
                   msg.role === 'user' ? 'bg-[#0b3d91] rounded-tr-md' : 'bg-[#2d3a5c] rounded-tl-md'
                )}
              >
                <div className="text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                <p className="text-xs text-[#b8c2d6] mt-2 text-right">{msg.time}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-4 self-start">
              <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xl bg-[#0b3d91]">
                <Bot size={24} />
              </div>
              <div className="flex items-center gap-2 p-4 bg-[#2d3a5c] rounded-2xl rounded-tl-md">
                <div className="w-2 h-2 rounded-full bg-white/70 animate-[typing_1.4s_infinite_ease-in-out]"></div>
                <div className="w-2 h-2 rounded-full bg-white/70 animate-[typing_1.4s_infinite_ease-in-out_0.2s]"></div>
                <div className="w-2 h-2 rounded-full bg-white/70 animate-[typing_1.4s_infinite_ease-in-out_0.4s]"></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 border-t border-[#2d3a5c] bg-[#1a243d]/80">
          <div className="flex gap-4 items-center">
            <input
              type="text"
              id="userInput"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask any space-related question..."
              autoComplete="off"
              className="flex-1 px-6 py-4 bg-[#0a1128] border border-[#2d3a5c] rounded-full text-white placeholder:text-[#b8c2d6] focus:outline-none focus:border-[#0b3d91] focus:ring-2 focus:ring-[#0b3d91]/50"
            />
            <button
              id="sendButton"
              onClick={handleSendMessage}
              className="w-14 h-14 rounded-full bg-[#0b3d91] text-white flex items-center justify-center transition-colors hover:bg-[#1e5bc9]"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
