'use client';

import { useState, useEffect } from 'react';
import { useChatStore } from '@/stores/useChatStore';
import type { ChatCategory, ChatQuestion } from '@/stores/useChatStore';
import { CategoryChip, QuestionChip } from '@/components/chat';
import Icon from '@/components/ui/Icon';
import { cn } from '@/lib/utils/cn';

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
  return 0.299 * r + 0.587 * g + 0.114 * b < 150;
}

const INITIAL_DISPLAY_COUNT = 3;

export default function CategoryChipContainer() {
  const {
    allCategories,
    activeCategoryId,
    isLoading,
    error,
    selectCategory,
    selectQuestion,
  } = useChatStore();

  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<ChatQuestion[]>([]);

  // Update active questions when category changes
  useEffect(() => {
    if (activeCategoryId) {
      const currentCategory = allCategories.find(
        (cat) => cat.id === activeCategoryId
      );
      setActiveQuestions(currentCategory ? currentCategory.questions : []);
    } else {
      setActiveQuestions([]);
    }
  }, [activeCategoryId, allCategories]);

  const displayedCategories = showAllCategories
    ? allCategories
    : allCategories.slice(0, INITIAL_DISPLAY_COUNT);

  const hasMoreButton =
    !showAllCategories && allCategories.length > INITIAL_DISPLAY_COUNT;
  const hasLessButton =
    showAllCategories && allCategories.length > INITIAL_DISPLAY_COUNT;

  const handleCategorySelect = (id: string, title: string) => {
    selectCategory(id);
    setShowAllCategories(false);
  };

  const handleQuestionSelect = (text: string) => {
    selectQuestion(text);
  };

  const handleModalClose = () => {
    setShowAllCategories(false);
  };

  const handleModalBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleModalClose();
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">Categorieën laden...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        <p className="text-sm font-semibold">Fout bij laden categorieën</p>
        <p className="text-xs">{error}</p>
      </div>
    );
  }

  if (allCategories.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-sm text-gray-500">Geen categorieën beschikbaar.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-2">
        <div
          className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg shadow"
          role="toolbar"
          aria-label="Categorieën"
        >
          {!activeCategoryId && (
            <button
              className="px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors whitespace-nowrap text-gray-900"
              style={{ backgroundColor: '#F8BBD9' }}
              onClick={() => setShowAllCategories(true)}
              aria-label="Kies een onderwerp"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#E91E63"
                  strokeWidth="2"
                  fill="#F8BBD9"
                />
                <path
                  d="M8 12h8M12 8v8"
                  stroke="#E91E63"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Kies een onderwerp
            </button>
          )}

          {displayedCategories.map((category) => (
            <CategoryChip
              key={category.id}
              category={category}
              onSelect={handleCategorySelect}
            />
          ))}

          {hasMoreButton && (
            <button
              onClick={() => setShowAllCategories(true)}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors whitespace-nowrap"
            >
              Meer...
            </button>
          )}

          {hasLessButton && (
            <button
              onClick={() => setShowAllCategories(false)}
              className="px-4 py-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors whitespace-nowrap"
            >
              Minder...
            </button>
          )}
        </div>
      </div>

      {/* Modal: Category Picker */}
      {showAllCategories && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-40"
          onClick={handleModalBackdropClick}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-labelledby="category-modal-title"
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              aria-label="Sluiten"
              onClick={handleModalClose}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <h2
              id="category-modal-title"
              className="text-lg font-bold mb-4 text-gray-800"
            >
              Waar kan ik je mee helpen?
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {allCategories.map((category) => {
                const textColorClass = isDarkColor(category.color)
                  ? 'text-white'
                  : 'text-gray-900';

                return (
                  <button
                    key={category.id}
                    className="flex flex-col items-center justify-center rounded-lg p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-pink-300"
                    style={{ backgroundColor: category.color }}
                    onClick={() =>
                      handleCategorySelect(category.id, category.title)
                    }
                    aria-label={category.title}
                  >
                    <Icon
                      name={category.icon}
                      size={28}
                      className={textColorClass}
                    />
                    <span
                      className={cn(
                        'mt-2 text-xs font-semibold',
                        textColorClass
                      )}
                    >
                      {category.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Question Suggestions */}
      {activeCategoryId && activeQuestions.length > 0 && (
        <div className="mt-3 p-2 bg-gray-50 rounded-lg shadow-inner">
          <h3 className="text-sm font-semibold text-gray-600 mb-2 px-1">
            Suggesties:
          </h3>
          {activeQuestions.map((question) => (
            <QuestionChip
              key={question.text}
              question={question}
              onSelect={handleQuestionSelect}
            />
          ))}
        </div>
      )}
    </>
  );
}
