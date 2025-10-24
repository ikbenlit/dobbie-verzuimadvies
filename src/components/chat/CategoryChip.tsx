import { ButtonHTMLAttributes } from 'react';
import Icon from '@/components/ui/Icon';
import type { ChatCategory } from '@/stores/useChatStore';
import { cn } from '@/lib/utils/cn';

interface CategoryChipProps {
  category: ChatCategory;
  onSelect: (id: string, title: string) => void;
  className?: string;
}

// Helper function to determine if a color is dark
function isDarkColor(hex: string): boolean {
  if (!hex) return false;
  const c = hex.replace('#', '');
  const rgb = parseInt(
    c.length === 3 ? c.split('').map((x) => x + x).join('') : c,
    16
  );
  const r = (rgb >> 16) & 255;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  // Luminance formula
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}

export default function CategoryChip({
  category,
  onSelect,
  className,
}: CategoryChipProps) {
  const textColorClass = isDarkColor(category.color)
    ? 'text-white'
    : 'text-gray-900';

  const handleClick = () => {
    onSelect(category.id, category.title);
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-opacity-50',
        textColorClass,
        className
      )}
      style={{ backgroundColor: category.color }}
      aria-label={`Selecteer categorie: ${category.title}`}
    >
      <Icon name={category.icon} size={18} className={textColorClass} />
      {category.title}
    </button>
  );
}
