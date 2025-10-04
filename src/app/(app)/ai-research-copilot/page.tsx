'use client';
import { useState, useEffect, useRef } from 'react';
import { Bot, User, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import { aiResearchCoPilot } from '@/ai/flows/ai-research-copilot';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export default function AiResearchCopilotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
        {
          role: 'assistant',
          text: `Hello! As a NASA space expert, I'm ready to share fascinating insights and factual information about space, astronomy, and the groundbreaking work of NASA. Our agency is dedicated to pioneering the future in space exploration, scientific discovery, and aeronautics research, constantly pushing the boundaries of human knowledge from understanding our home planet to exploring distant galaxies. I'm here to answer any specific questions you might have about our missions, discoveries, or the cosmos itself. What would you like to explore today?`,
        },
      ]);
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        // A bit of a hack, but it works to scroll to the bottom after the new message is rendered.
        setTimeout(() => {
            const viewport = scrollAreaRef.current?.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTop = viewport.scrollHeight;
            }
        }, 100);
    }
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
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    scrollToBottom();

    try {
      const response = await aiResearchCoPilot({ query: trimmedInput });
      const assistantMessage: Message = {
        role: 'assistant',
        text: response.answer,
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching AI response:', error);
      const errorMessage: Message = {
        role: 'assistant',
        text: "I'm currently experiencing technical difficulties. Please try again in a moment.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      scrollToBottom();
    }
  };
  
  const formatText = (text: string) => {
    const bolded = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return bolded.replace(/\n/g, '<br />');
  };
  
  return (
    <div className="h-full flex flex-col">
        <Card className="flex flex-col h-full w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>AI Research Co-Pilot</CardTitle>
                <CardDescription>Your intelligent assistant for all things NASA and space-related.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
                <ScrollArea className="flex-1 p-6" viewportRef={scrollAreaRef}>
                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <div
                            key={index}
                            className={cn(
                                'flex items-start gap-4',
                                msg.role === 'user' ? 'justify-end' : 'justify-start'
                            )}
                            >
                            {msg.role === 'assistant' && (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <Bot className="w-6 h-6 text-primary-foreground" />
                                </div>
                            )}
                            <div
                                className={cn(
                                'p-4 rounded-lg max-w-[85%]',
                                msg.role === 'user' 
                                    ? 'bg-primary text-primary-foreground rounded-br-none' 
                                    : 'bg-muted rounded-bl-none'
                                )}
                            >
                                <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formatText(msg.text) }} />
                            </div>
                            {msg.role === 'user' && (
                                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                <User className="w-6 h-6 text-secondary-foreground" />
                                </div>
                            )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex items-start gap-4 self-start">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                                <Bot className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <div className="flex items-center gap-2 p-4 bg-muted rounded-lg rounded-bl-none">
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{animationDelay: '0.4s'}}></div>
                            </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                <div className="p-4 border-t">
                    <div className="flex gap-2 items-center">
                        <Input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask any space-related question..."
                            autoComplete="off"
                            className="flex-1"
                        />
                        <Button
                            onClick={handleSendMessage}
                            disabled={isTyping}
                        >
                            <Send className="w-4 h-4" />
                            <span className="sr-only">Send</span>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
