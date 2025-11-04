import { ButtonHTMLAttributes } from 'react';
import type { ChatQuestion } from '@/stores/useChatStore';
import { cn } from '@/lib/utils/cn';

interface QuestionChipProps {
  question: ChatQuestion;
  onSelect: (text: string) => void;
  className?: string;
}

export default function QuestionChip({
  question,
  onSelect,
  className,
}: QuestionChipProps) {
  const handleClick = () => {
    onSelect(question.text);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'my-1 w-full rounded-lg border border-gray-300 bg-white p-3 text-left shadow-sm transition-colors duration-150 ease-in-out hover:bg-gray-50 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      aria-label={`Selecteer vraag: ${question.text}`}
    >
      <p className="text-sm text-gray-700">{question.text}</p>
    </button>
  );
}
