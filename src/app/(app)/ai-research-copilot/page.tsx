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
          text: `<strong>Welcome to NASA AI Copilot!</strong><br/><br/>I'm your intelligent assistant for all things NASA and space-related. I can answer questions about:<br/><br/>• Space missions and exploration<br/>• Astronomy and astrophysics<br/>• Rocket science and technology<br/>• Planetary science<br/>• NASA history and future plans<br/>• Space research and discoveries<br/><br/>Ask me anything - I'll do my best to provide comprehensive, accurate information!`,
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
        }, 0);
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
    }
  };
  
  return (
    <div className="h-full flex flex-col">
        <Card className="flex flex-col h-full">
            <CardHeader className="bg-primary/10">
                <CardTitle>Space Exploration Assistant</CardTitle>
                <CardDescription>Ask me anything about NASA missions, astronomy, and space science</CardDescription>
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
                                <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
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
