'use client';

import { useState, useEffect, useRef } from 'react';
import { useChatStore } from '@/stores';
import {
  ChatMessage,
  ChatInput,
  CategoryChipContainer,
  TypingIndicator,
} from '@/components/chat';

// Message interface
interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
  role?: 'user' | 'model';
}

const WELCOME_MESSAGE = 'Hoi! Fijn dat je er bent. Waarmee kan ik je helpen?';

export default function ChatPage() {
  // Chat store
  const {
    showCategoryPicker,
    selectedQuestionText,
    clearSelectedQuestion,
  } = useChatStore();

  // State
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const processingQuestionRef = useRef(false);

  // Initialize chat with welcome message
  useEffect(() => {
    setMessages([
      {
        id: Date.now(),
        sender: 'bot',
        text: WELCOME_MESSAGE,
        role: 'model',
      },
    ]);
  }, []);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  };

  // Scroll when messages change or typing state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle selected question from category chips
  useEffect(() => {
    if (selectedQuestionText && !processingQuestionRef.current) {
      processingQuestionRef.current = true;
      sendMessage(selectedQuestionText);
      clearSelectedQuestion();

      // Reset processing flag after a short delay
      setTimeout(() => {
        processingQuestionRef.current = false;
      }, 100);
    }
  }, [selectedQuestionText, clearSelectedQuestion]);

  // Process streaming API response
  const processStream = async (response: Response, botMessageId: number) => {
    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentBotText = '';
    let isFirstChunk = true;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });

      // Check if first chunk is model info
      if (isFirstChunk) {
        try {
          const modelInfo = JSON.parse(chunk);
          if (modelInfo.type === 'model') {
            console.log('Model:', modelInfo.model);
            isFirstChunk = false;
            continue;
          }
        } catch {
          // Not JSON, treat as normal text
        }
        isFirstChunk = false;
      }

      currentBotText += chunk;

      // Update bot message with streaming text
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: currentBotText }
            : msg
        )
      );
    }
  };

  // Send message to API
  const sendMessage = async (text: string) => {
    const textToSend = text.trim();
    if (!textToSend) return;

    // Add user message
    const newUserMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: textToSend,
      role: 'user',
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Show typing indicator
    setIsTyping(true);

    // Add empty bot message for streaming
    const botMessageId = Date.now() + 1;
    setMessages((prev) => [
      ...prev,
      {
        id: botMessageId,
        sender: 'bot',
        text: '',
        role: 'model',
      },
    ]);

    try {
      // Prepare messages for API (only include role and content)
      const messagesForAPI = messages
        .concat([newUserMessage])
        .filter((msg) => msg.role)
        .map((msg) => ({
          role: msg.role,
          content: msg.text,
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesForAPI }),
      });

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      await processStream(response, botMessageId);
    } catch (error) {
      console.error('Error streaming API:', error);

      // Update bot message with error
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? {
                ...msg,
                text: 'Oeps, DOBbie ligt er zelf even uit. Probeer het zo opnieuw!',
              }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white text-[#3D3D3D]">
      {/* Messages Area */}
      <div
        ref={scrollContainerRef}
        className="chat-messages flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 bg-white"
      >
        {/* Category Picker */}
        {showCategoryPicker && (
          <div className="mt-1 mb-3">
            <CategoryChipContainer />
          </div>
        )}

        {/* Messages */}
        {messages.map((message, index) => {
          const showAvatar =
            message.sender === 'bot' &&
            (index === 0 || messages[index - 1].sender !== 'bot');

          return (
            <ChatMessage
              key={message.id}
              message={message.text}
              sender={message.sender}
              showAvatar={showAvatar}
            />
          );
        })}

        {/* Typing Indicator */}
        {isTyping && <TypingIndicator />}
      </div>

      {/* Input Area */}
      <ChatInput
        onSendMessage={sendMessage}
        disabled={isTyping}
        placeholder="Typ uw vraag hier..."
      />
    </div>
  );
}
