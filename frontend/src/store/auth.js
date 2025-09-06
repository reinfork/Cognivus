import { reactive } from 'vue';
import { supabase } from '../supabase';

export const authStore = reactive({
  user: null,
  token: localStorage.getItem('token') || null,
  isInitialized: false,

  async init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      this.setAuth(session.user, session.access_token);
    }
    this.isInitialized = true;
  },

  setAuth(user, token) {
    console.log('Setting auth:', { user, token: token ? 'present' : 'null' });
    this.user = user;
    this.token = token;
    localStorage.setItem('token', token);
    console.log('Auth state after setAuth:', {
      user: this.user,
      token: this.token ? 'present' : 'null',
      isAuthenticated: this.isAuthenticated()
    });
    // Also set the session in Supabase client for consistency
    if (token) {
      const refreshToken = localStorage.getItem('refresh_token') || '';
      console.log('Setting Supabase session with tokens');
      supabase.auth.setSession({
        access_token: token,
        refresh_token: refreshToken
      });
    }
  },

  clearAuth() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    supabase.auth.signOut();
  },

  isAuthenticated() {
    return !!this.token;
  }
});
