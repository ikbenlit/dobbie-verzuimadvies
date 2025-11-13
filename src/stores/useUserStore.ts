import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@/lib/supabase/client';
import type { Session } from '@supabase/supabase-js';

// Extended User interface for DoBbie-specific data
export interface User {
  id: string;
  email: string;
  full_name?: string;
  account_type?: 'individual' | 'organization_member';
  organization_id?: string;
  subscription_status?: 'inactive' | 'active' | 'expired' | 'blocked';
  role: string;
}

// User store state interface
interface UserStoreState {
  // State
  user: User | null;
  session: Session | null;
  loading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  updateAuthState: (session: Session | null, loading?: boolean) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  clearUser: () => void;
}

// Helper function to convert Supabase session to User
function sessionToUser(session: Session | null): User | null {
  if (!session?.user?.email) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    full_name: session.user.user_metadata?.full_name,
    account_type: session.user.user_metadata?.account_type,
    organization_id: session.user.user_metadata?.organization_id,
    subscription_status: session.user.user_metadata?.subscription_status,
    role: session.user.user_metadata?.role ?? 'user',
  };
}

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      session: null,
      loading: true,

      // Actions
      setUser: (user) => set({ user }),

      setSession: (session) => set({ session }),

      setLoading: (loading) => set({ loading }),

      updateAuthState: (session, loading = false) => {
        const user = sessionToUser(session);
        set({ user, session, loading });
      },

      signIn: async (email: string, password: string) => {
        set({ loading: true });

        try {
          const supabase = createClient();

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          // Fetch complete profile data from database
          if (data.session?.user) {
            console.log(
              'Fetching profile data for user after login:',
              data.session.user.id
            );

            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select(
                'subscription_status, full_name, account_type, organization_id, user_type'
              )
              .eq('id', data.session.user.id)
              .single();

            if (!profileError && profile) {
              console.log('Profile data loaded:', profile);

              // Update session with profile data
              const updatedSession = {
                ...data.session,
                user: {
                  ...data.session.user,
                  user_metadata: {
                    ...data.session.user.user_metadata,
                    subscription_status: profile.subscription_status,
                    full_name: profile.full_name,
                    account_type: profile.account_type,
                    organization_id: profile.organization_id,
                    role: profile.user_type || 'user',
                  },
                },
              };

              get().updateAuthState(updatedSession, false);
            } else {
              console.error('Error fetching profile data:', profileError);
              get().updateAuthState(data.session, false);
            }
          }
        } catch (error) {
          set({ loading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ loading: true });

        try {
          const supabase = createClient();
          const { error } = await supabase.auth.signOut();

          if (error) throw error;

          get().updateAuthState(null, false);
        } catch (error) {
          console.error('Error signing out:', error);
          // Reset state anyway
          get().updateAuthState(null, false);
          throw error;
        }
      },

      initializeAuth: async () => {
        const supabase = createClient();

        try {
          // Use getUser() for security
          const {
            data: { user },
            error,
          } = await supabase.auth.getUser();

          if (error) {
            console.error('Error getting user:', error);
            get().updateAuthState(null, false);
          } else if (user) {
            // Get the session after verifying user
            const {
              data: { session },
            } = await supabase.auth.getSession();
            console.log('Auth state initialized:', user.email);
            get().updateAuthState(session, false);
          } else {
            get().updateAuthState(null, false);
          }
        } catch (error) {
          console.error('Error during auth initialization:', error);
          get().updateAuthState(null, false);
        }

        // Listen for auth state changes
        supabase.auth.onAuthStateChange((event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          get().updateAuthState(session, false);
        });
      },

      clearUser: () => {
        get().updateAuthState(null, false);
      },
    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        // Don't persist session for security
        user: state.user,
      }),
    }
  )
);

// Helper hook for derived states
export const useIsAuthenticated = () => {
  return useUserStore((state) => !!state.user);
};

export const useCurrentUser = () => {
  return useUserStore((state) => state.user);
};

export const useAuthLoading = () => {
  return useUserStore((state) => state.loading);
};
