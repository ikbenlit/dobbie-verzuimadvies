import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import chatCategoryData from '@/lib/data/chat_category.json';

// Chat types
export interface ChatQuestion {
  text: string;
  displayOrder: number;
}

export interface ChatCategory {
  id: string;
  title: string;
  color: string;
  icon: string;
  questions: ChatQuestion[];
}

export interface ChatData {
  version: string;
  createdAt: string;
  updatedAt: string;
  categoriesData: ChatCategory[];
}

// Chat store state interface
interface ChatStoreState {
  // State
  allCategories: ChatCategory[];
  activeCategoryId: string | null;
  showCategoryPicker: boolean;
  isLoading: boolean;
  error: string | null;
  selectedQuestionText: string | null;

  // Actions
  fetchCategoriesData: () => void;
  toggleCategoryPicker: () => void;
  selectCategory: (id: string | null) => void;
  selectQuestion: (questionText: string) => void;
  clearSelectedQuestion: () => void;
}

// Initialize and sort categories
function initializeCategories(): ChatCategory[] {
  try {
    const typedData = chatCategoryData as ChatData;

    // Sort questions within each category by displayOrder
    const sortedCategories = typedData.categoriesData.map((category) => ({
      ...category,
      questions: [...category.questions].sort(
        (a, b) => a.displayOrder - b.displayOrder
      ),
    }));

    return sortedCategories;
  } catch (error) {
    console.error('Failed to load categories:', error);
    return [];
  }
}

export const useChatStore = create<ChatStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      allCategories: [],
      activeCategoryId: null,
      showCategoryPicker: true,
      isLoading: false,
      error: null,
      selectedQuestionText: null,

      // Actions
      fetchCategoriesData: () => {
        set({ isLoading: true, error: null });
        try {
          const categories = initializeCategories();
          set({
            allCategories: categories,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
          console.error('Failed to load categories:', errorMessage);
          set({
            isLoading: false,
            error: `Kon categorie data niet laden: ${errorMessage}`,
          });
        }
      },

      toggleCategoryPicker: () => {
        set((state) => ({
          showCategoryPicker: !state.showCategoryPicker,
        }));
      },

      selectCategory: (id: string | null) => {
        if (id === null) {
          set({ activeCategoryId: null });
          return;
        }

        const state = get();
        const categoryExists = state.allCategories.some((cat) => cat.id === id);

        if (categoryExists) {
          set({ activeCategoryId: id });
        } else {
          console.warn(`Category with id "${id}" not found.`);
        }
      },

      selectQuestion: (questionText: string) => {
        set({ selectedQuestionText: questionText });
      },

      clearSelectedQuestion: () => {
        set({ selectedQuestionText: null });
      },
    }),
    {
      name: 'chat-storage', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        activeCategoryId: state.activeCategoryId,
        showCategoryPicker: state.showCategoryPicker,
      }),
    }
  )
);

// Initialize categories on store creation
if (typeof window !== 'undefined') {
  useChatStore.getState().fetchCategoriesData();
}
