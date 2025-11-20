'use client';

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { v4 as uuid } from 'uuid';
import { PromptInputBox } from '@/components/ai/ai-prompt-box';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/lib/stores/auth-store';
import { createAvatar } from '@dicebear/core';
import { avataaarsNeutral } from '@dicebear/collection';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  prefix?: string;
}

export default function AIPage() {
  const user = useAuthStore((state) => state.user);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Generate avatar once
  const userAvatar = useMemo(
    () =>
      createAvatar(avataaarsNeutral, {
        size: 128,
        seed: user?.name || 'user',
        radius: 0,
      }).toDataUri(),
    [user?.name]
  );

  // Scroll to bottom automatically
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Parse prefix safely
  const parseInput = useCallback((raw: string) => {
    const regex = /^\[(.+?)\]:?\s*(.*)$/;
    const match = raw.match(regex);
    if (!match) return { prefix: undefined, content: raw };
    return { prefix: match[1], content: match[2] };
  }, []);

  // Core message handler
  const handleSendMessage = useCallback(
    async (rawMessage: string, files?: File[]) => {
      const trimmed = rawMessage.trim();
      if (!trimmed) return;

      const { prefix, content } = parseInput(trimmed);

      const userMessage: Message = {
        id: uuid(),
        type: 'user',
        content,
        prefix,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        // TODO: Replace with actual AI backend endpoint
        const simulatedAIResponse = await new Promise<string>((resolve) =>
          setTimeout(
            () =>
              resolve(
                `This is a simulated response to: **${content}**  
(Replace this with real backend API call)`
              ),
            900
          )
        );

        const aiMessage: Message = {
          id: uuid(),
          type: 'ai',
          content: simulatedAIResponse,
          timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage: Message = {
          id: uuid(),
          type: 'ai',
          content:
            '⚠️ Something went wrong. Please try again or check your connection.',
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    [parseInput]
  );

  return (
    <div className="flex flex-col h-[88vh] bg-background">
      {/* Messages Area */}
      <ScrollArea className="flex-1 overflow-hidden px-2 md:px-0"  >
      
        <div className="max-w-3xl mx-auto py-6 space-y-4">
          {/* Empty state */}
          {messages.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
              <h1 className="text-3xl font-semibold mb-2">
                Welcome,
                <span className="ml-2 bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">
                  {user?.name || 'User'}
                </span>
              </h1>
              <p className="text-muted-foreground">
                Ask anything and I’ll help you instantly.
              </p>
            </div>
          )}

          {/* Chat messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-3 animate-fade-up',
                msg.type === 'user' && 'flex-row-reverse'
              )}
            >
              {/* Avatar */}
              <Avatar className="h-8 w-8">
                {msg.type === 'user' ? (
                  <>
                    <AvatarImage src={userAvatar} alt="You" />
                    <AvatarFallback className="text-xs bg-primary/20 text-primary rounded-none">
                      {user?.name?.[0]?.toUpperCase() ?? 'U'}
                    </AvatarFallback>
                  </>
                ) : (
                  <>
                    <AvatarImage src="/ai-avatar.png" alt="AI" />
                    <AvatarFallback className="text-xs bg-blue-500/20 text-blue-600 rounded-none">
                      AI
                    </AvatarFallback>
                  </>
                )}
              </Avatar>

              {/* Message bubble */}
              <div
                className={cn(
                  'rounded-xl px-2 py-1.5 max-w-[75%] whitespace-pre-wrap text-sm shadow-sm',
                  msg.type === 'ai'
                    ? ' shadow-none text-foreground rounded-tl-none'
                    : 'bg-accent  rounded-tr-none'
                )}
              >
                {msg.prefix && (
                  <div className="text-[10px] uppercase tracking-wide font-bold opacity-70 mb-1">
                    [{msg.prefix}]
                  </div>
                )}

                <div dangerouslySetInnerHTML={{ __html: msg.content }} />
              </div>

              {/* Timestamp 
              <time className="text-[10px] text-muted-foreground self-end select-none">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </time>*/}
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex items-center gap-2 animate-fade-up">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-blue-500/20 text-blue-600 rounded-none">
                  AI
                </AvatarFallback>
              </Avatar>

              <div className="bg-muted px-4 py-3 rounded-2xl rounded-tl-none flex gap-1">
                <div className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                <div
                  className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0.15s' }}
                />
                <div
                  className="h-2 w-2 bg-muted-foreground/50 rounded-full animate-bounce"
                  style={{ animationDelay: '0.3s' }}
                />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
        <ScrollBar className='w-2' />
      </ScrollArea>

      {/* Input area */}
      <div className="sticky bottom-0 left-0 right-0 py-2">
        <div className="max-w-2xl mx-auto px-3">
          <PromptInputBox
            onSend={handleSendMessage}
            isLoading={isLoading}
            placeholder="Type your message…"
          />
        </div>
      </div>
    </div>
  );
}
