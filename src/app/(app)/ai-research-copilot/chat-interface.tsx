'use client';

import { useFormStatus } from 'react-dom';
import { askAiCopilot, type FormState } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowUp, Bot, BrainCircuit, User } from 'lucide-react';
import { useActionState, useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
};

const initialState: FormState = {
  query: '',
};

function ChatMessages({
  messages,
  isPending,
  lastQuery,
}: {
  messages: Message[];
  isPending: boolean;
  lastQuery: string;
}) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isPending]);

  return (
    <ScrollArea className="flex-1" ref={scrollAreaRef}>
      <div className="p-4 space-y-6">
        {messages.length === 0 && !isPending && (
          <div className="text-center text-muted-foreground flex flex-col items-center gap-4 py-16">
            <BrainCircuit className="w-16 h-16 text-accent" />
            <h2 className="text-2xl font-headline">AI Research Co-Pilot</h2>
            <p>Ready to assist with your questions about NASA bioscience.</p>
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn('flex items-start gap-4', {
              'justify-end': message.role === 'user',
            })}
          >
            {message.role === 'assistant' && (
              <Avatar>
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
            )}
            <Card
              className={cn('max-w-[85%]', {
                'bg-primary/20 border-primary/30': message.role === 'user',
              })}
            >
              <CardContent className="p-3 text-sm whitespace-pre-wrap">
                {message.content}
              </CardContent>
            </Card>
            {message.role === 'user' && (
              <Avatar>
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isPending && (
          <>
            <div className="flex items-start gap-4 justify-end">
              <Card className="max-w-[85%] bg-primary/20 border-primary/30">
                <CardContent className="p-3 text-sm">
                  {lastQuery}
                </CardContent>
              </Card>
              <Avatar>
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start gap-4">
              <Avatar>
                <AvatarFallback>
                  <Bot />
                </AvatarFallback>
              </Avatar>
              <Card className="max-w-[85%]">
                <CardContent className="p-3 space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </ScrollArea>
  );
}

function ChatFormContent({ error }: { error?: string }) {
  const { pending } = useFormStatus();

  return (
    <>
      <div className="p-4 border-t bg-background">
        <div className="flex items-center gap-2">
          <Input
            name="query"
            placeholder="e.g., What are the effects of microgravity on plant growth?"
            required
            disabled={pending}
            autoComplete="off"
          />
          <Button
            type="submit"
            size="icon"
            disabled={pending}
            aria-label="Send message"
          >
            <ArrowUp />
          </Button>
        </div>
        {error && !pending && (
          <p className="text-destructive text-sm mt-2">{error}</p>
        )}
      </div>
    </>
  );
}

export function ChatInterface() {
  const [state, formAction] = useActionState(askAiCopilot, initialState);
  const [messages, setMessages] = useState<Message[]>([]);
  const formRef = useRef<HTMLFormElement>(null);
  const { pending } = useFormStatus();
  const [lastQuery, setLastQuery] = useState('');

  useEffect(() => {
    // This effect runs when the server action completes
    if (!pending && state.query) {
      const userMessageExists = messages.some(
        (m) => m.role === 'user' && m.content === state.query
      );

      // Add user message if it wasn't the one that initiated the pending state
      if (!userMessageExists) {
        setMessages((prev) => [
          ...prev,
          {
            id: `user-${Date.now()}`,
            role: 'user',
            content: state.query,
          },
        ]);
      }
      // Add assistant response
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: state.answer || `Error: ${state.error!}`,
        },
      ]);

      formRef.current?.reset();
      setLastQuery('');
    }
  }, [state, pending, messages]);

  const handleAction = (formData: FormData) => {
    const query = formData.get('query') as string;
    setLastQuery(query);
    formAction(formData);
  };

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <form
        ref={formRef}
        action={handleAction}
        className="flex flex-1 flex-col overflow-hidden"
      >
        <ChatMessages
          messages={messages}
          isPending={pending}
          lastQuery={lastQuery}
        />
        <ChatFormContent error={state.error} />
      </form>
    </div>
  );
}
