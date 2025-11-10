/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// If env vars are missing, avoid throwing during module import (which causes
// an uncaught error in the browser). Instead export a lightweight proxy that
// surfaces helpful runtime errors when someone actually tries to call Supabase
// methods. This keeps the app running (so UI and fallbacks work) while making
// the missing-config problem obvious in logs.
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  const message = 'Supabase is not configured: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY.';
  // Developer-friendly console warning
  // eslint-disable-next-line no-console
  console.warn(message, { supabaseUrl, supabaseAnonKey });

  // Create a proxy that returns functions which reject with a clear error
  // when called. This prevents uncaught exceptions at import time.
  const createRejectingFn = (path: string) => {
    return (..._args: any[]) => {
      return Promise.reject(new Error(`${message} Called: ${path}`));
    };
  };

  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      // Return nested proxies for objects (like supabase.auth.getSession)
      if (prop === Symbol.toStringTag) return 'NoopSupabaseClient';
      return new Proxy(createRejectingFn(String(prop)), {
        get(_t, p) {
          // e.g. supabase.auth.getSession -> return a rejecting function
          return createRejectingFn(`supabase.${String(prop)}.${String(p)}`);
        },
        apply(target, _thisArg, _args) {
          return target(..._args);
        },
      });
    },
  };

  supabase = new Proxy({}, handler);
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const resetPassword = async (email: string, redirectTo?: string) => {
  // Use provided redirectTo or fallback to env-configured app URL
  const appUrl = (import.meta.env.VITE_APP_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
  const finalRedirect = redirectTo || `${appUrl.replace(/\/$/, '')}/reset-password`;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: finalRedirect });
  return { data, error };
};
