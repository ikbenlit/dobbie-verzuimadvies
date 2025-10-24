import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

// UI store state interface
interface UIStoreState {
  // Sidebar state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  // Theme state
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  initializeTheme: () => void;

  // Mobile menu state
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  setMobileMenuOpen: (open: boolean) => void;
}

// Helper function to get initial theme
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'light'; // SSR default
  }

  // Check localStorage first
  const savedTheme = localStorage.getItem('theme') as Theme;
  if (savedTheme) return savedTheme;

  // Check user preference
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// Helper function to apply theme to DOM
function applyTheme(theme: Theme) {
  if (typeof window === 'undefined') return;

  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('theme', theme);
}

export const useUIStore = create<UIStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarOpen: false,
      theme: 'light', // Will be initialized properly on client
      mobileMenuOpen: false,

      // Sidebar actions
      toggleSidebar: () => {
        set((state) => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      // Theme actions
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme: Theme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(newTheme);
        set({ theme: newTheme });
      },

      setTheme: (theme: Theme) => {
        applyTheme(theme);
        set({ theme });
      },

      initializeTheme: () => {
        const theme = getInitialTheme();
        applyTheme(theme);
        set({ theme });
      },

      // Mobile menu actions
      toggleMobileMenu: () => {
        set((state) => ({ mobileMenuOpen: !state.mobileMenuOpen }));
      },

      setMobileMenuOpen: (open: boolean) => {
        set({ mobileMenuOpen: open });
      },
    }),
    {
      name: 'ui-storage', // localStorage key
      partialize: (state) => ({
        // Only persist theme and sidebar preference
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);

// Initialize theme on client side
if (typeof window !== 'undefined') {
  useUIStore.getState().initializeTheme();
}

// Helper hooks for convenience
export const useSidebar = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const setSidebarOpen = useUIStore((state) => state.setSidebarOpen);

  return { sidebarOpen, toggleSidebar, setSidebarOpen };
};

export const useTheme = () => {
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  const setTheme = useUIStore((state) => state.setTheme);

  return { theme, toggleTheme, setTheme };
};

export const useMobileMenu = () => {
  const mobileMenuOpen = useUIStore((state) => state.mobileMenuOpen);
  const toggleMobileMenu = useUIStore((state) => state.toggleMobileMenu);
  const setMobileMenuOpen = useUIStore((state) => state.setMobileMenuOpen);

  return { mobileMenuOpen, toggleMobileMenu, setMobileMenuOpen };
};
