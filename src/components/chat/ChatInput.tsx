'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSendMessage,
  disabled = false,
  placeholder = "Typ uw vraag hier..."
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (trimmed && !disabled) {
      onSendMessage(trimmed);
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !disabled) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input-container p-4 border-t border-[#D1D5DB] flex gap-3 items-center bg-white">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        disabled={disabled}
        className="chat-input flex-1 p-4 border border-[#D1D5DB] rounded-md text-base min-h-[48px] font-['Open_Sans'] focus:outline-none focus:border-[#771138] focus:ring-2 focus:ring-[#771138]/20 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button
        onClick={handleSubmit}
        disabled={disabled || !input.trim()}
        className="send-button bg-[#771138] text-white rounded-md w-12 h-12 flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#5A0D29] disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Verzend bericht"
      >
        <Send className="w-5 h-5" />
      </button>
    </div>
  );
}
