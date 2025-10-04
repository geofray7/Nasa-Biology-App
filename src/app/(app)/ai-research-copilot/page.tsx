'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send, Rocket, User as UserIcon, Robot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiResearchCoPilot } from '@/ai/flows/ai-research-copilot';

interface Message {
  role: 'user' | 'assistant';
  text: string;
  time: string;
}

const Star = () => {
  const style = {
    width: `${Math.random() * 2 + 1}px`,
    height: `${Math.random() * 2 + 1}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 3 + 2}s`,
  };
  return <div className="absolute bg-white rounded-full animate-twinkle" style={style}></div>;
};

const getCurrentTime = () => {
  const now = new Date();
  return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
};

export default function AiResearchCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
        {
          role: 'assistant',
          text: `<strong>Welcome to NASA Space Exploration Assistant!</strong><br/><br/>I'm your AI assistant for all things space-related. I can help you with:<br/><br/>• NASA missions and spacecraft<br/>• Astronomy and astrophysics<br/>• Planetary science<br/>• Rocket technology<br/>• Space exploration history<br/>• And much more!<br/><br/>What would you like to know about space today?`,
          time: getCurrentTime(),
        },
      ]);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (question?: string) => {
    const trimmedInput = question || inputValue.trim();
    if (!trimmedInput) return;

    const userMessage: Message = {
      role: 'user',
      text: trimmedInput,
      time: getCurrentTime(),
    };
    setMessages(prev => [...prev, userMessage]);
    if (!question) {
        setInputValue('');
    }
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
        text: "I'm currently experiencing technical difficulties. Please try again in a moment.",
        time: getCurrentTime(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const initialSuggestions = [
    { text: "Artemis Program", icon: "🌙" },
    { text: "James Webb Telescope", icon: "🔭" },
    { text: "How do rockets work?", icon: "🚀" },
    { text: "Latest Mars rover discoveries", icon: "🔴" },
  ];

  return (
    <div className="flex justify-center items-center h-full bg-gradient-to-br from-[#0a1128] to-[#1a243d] p-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
            {Array.from({ length: 150 }).map((_, i) => <Star key={i} />)}
        </div>
        
        <div className="w-full max-w-4xl h-[85vh] bg-slate-900/80 rounded-2xl shadow-2xl border border-blue-500/30 backdrop-blur-2xl flex flex-col overflow-hidden z-10">
            <div className="bg-gradient-to-r from-blue-900 to-blue-800 p-6 text-center border-b border-blue-500/30">
                <div className="flex items-center justify-center gap-4 text-4xl mb-2 text-red-500">
                    <Rocket />
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">NASA</span>
                </div>
                <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">Space Exploration Assistant</h1>
                <p className="text-lg text-slate-300/90 max-w-2xl mx-auto leading-normal">Ask me anything about NASA missions, astronomy, and space science</p>
            </div>

            <div ref={messagesEndRef} className="flex-1 p-6 overflow-y-auto space-y-5">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex items-start gap-4 max-w-[85%] animate-messageSlide',
                    msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
                  )}
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xl shadow-lg',
                      msg.role === 'user' ? 'bg-gradient-to-br from-red-500 to-orange-500 border-2 border-red-500/50' : 'bg-gradient-to-br from-blue-800 to-blue-600 border-2 border-blue-500/50'
                    )}
                  >
                    {msg.role === 'user' ? <UserIcon size={24} /> : <Robot size={24} />}
                  </div>
                  <div
                    className={cn(
                      'p-5 rounded-2xl shadow-md border border-white/10 backdrop-blur-sm',
                      msg.role === 'user' ? 'bg-gradient-to-br from-blue-800 to-blue-700 rounded-br-md' : 'bg-slate-800/70 rounded-bl-md'
                    )}
                  >
                    <div className="text-base leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                    <p className="text-xs text-slate-400 mt-2 text-right">{msg.time}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-4 self-start animate-messageSlide">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xl bg-gradient-to-br from-blue-800 to-blue-600 border-2 border-blue-500/50">
                    <Robot size={24} />
                  </div>
                  <div className="flex items-center gap-3 p-5 bg-slate-800/70 rounded-2xl rounded-bl-md backdrop-blur-sm border border-white/10">
                    <div className="w-3 h-3 rounded-full bg-slate-400 animate-typing"></div>
                    <div className="w-3 h-3 rounded-full bg-slate-400 animate-typing" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-3 h-3 rounded-full bg-slate-400 animate-typing" style={{animationDelay: '0.4s'}}></div>
                    <span className="text-slate-400">NASA AI is researching...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 border-t border-blue-500/20 bg-slate-900/50 backdrop-blur-xl">
               <div className="flex flex-wrap justify-center gap-3 mb-4">
                  {initialSuggestions.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(suggestion.text)}
                      className="px-5 py-3 rounded-full text-sm bg-blue-900/50 border border-blue-600/50 text-slate-300 hover:bg-blue-800/70 hover:text-white transition-all transform hover:-translate-y-1"
                    >
                      {suggestion.icon} {suggestion.text}
                    </button>
                  ))}
              </div>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask any space-related question..."
                  autoComplete="off"
                  className="flex-1 px-7 py-4 bg-slate-800/50 border border-blue-700/60 rounded-full text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-700 to-blue-600 text-white flex items-center justify-center transition-all hover:from-blue-600 hover:to-blue-500 hover:scale-105 shadow-lg shadow-blue-900/50"
                >
                  <Send size={24} />
                </button>
              </div>
            </div>
        </div>
      <style jsx global>{`
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 3s infinite;
        }

        @keyframes messageSlide {
            from {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
            }
            to {
                opacity: 1;
                transform: translateY(0) scale(1);
            }
        }
        .animate-messageSlide {
          animation: messageSlide 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes typing {
          0%, 80%, 100% { 
              transform: scale(0.8);
              opacity: 0.5;
          }
          40% { 
              transform: scale(1);
              opacity: 1;
          }
        }
        .animate-typing {
          animation: typing 1.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
