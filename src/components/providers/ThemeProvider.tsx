'use client';

import { useEffect, useState } from 'react';
import { useUIStore } from '@/stores/useUIStore';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const initializeTheme = useUIStore((state) => state.initializeTheme);

  useEffect(() => {
    setMounted(true);
    // Initialize theme on mount
    initializeTheme();
  }, [initializeTheme]);

  if (!mounted) {
    return <>{children}</>;
  }

  return <>{children}</>;
}

// Re-export useTheme from the store for backward compatibility
export { useTheme } from '@/stores/useUIStore';
