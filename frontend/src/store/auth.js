import { reactive } from 'vue';

export const authStore = reactive({
  user: null,
  token: localStorage.getItem('token') || null,

  setAuth(user, token) {
    this.user = user;
    this.token = token;
    localStorage.setItem('token', token);
  },

  clearAuth() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('token');
  },

  isAuthenticated() {
    return !!this.token;
  }
});