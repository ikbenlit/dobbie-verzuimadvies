'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (supabaseClient) return supabaseClient;

  supabaseClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  return supabaseClient;
}

// Auth helper functions for client components
export function useSupabaseAuth() {
  const router = useRouter();
  const supabase = createClient();

  return {
    // Login functie
    async signIn(email: string, password: string) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase auth error:', error.message);
        throw error;
      }

      router.refresh();
      return data;
    },

    // Logout functie
    async signOut() {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signout error:', error.message);
        throw error;
      }
      // Redirect naar login
      router.push('/login');
      router.refresh();
    },

    // Get current session
    async getSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error.message);
        return null;
      }
      return session;
    },

    // Get current user
    async getUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting user:', error.message);
        return null;
      }
      return user;
    },
  };
}

// Export default client voor direct gebruik
export default createClient;