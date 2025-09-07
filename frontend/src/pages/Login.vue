<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../store/auth';
import apiClient from '../services/api';
import { supabase } from '../supabase';
import ittrLogo from '../assets/ittrlogo.png';
import kucingterbang from '../assets/kucingterbang.png';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

const handleLogin = async () => {
  errorMessage.value = '';
  try {
    console.log('Attempting login with:', { email: email.value, password: password.value ? '***' : '' });
    const response = await apiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    console.log('Login response:', response.data);

    if (response.data.success) {
      // Ambil user dan token dari respons
      const { user, session } = response.data;
      console.log('User:', user);
      console.log('Session:', session);

      // Simpan token dan refresh token
      localStorage.setItem('refresh_token', session.refresh_token);
      console.log('Stored refresh token');

      // Simpan di state management
      authStore.setAuth(user, session.access_token);
      console.log('Auth store updated, isAuthenticated:', authStore.isAuthenticated());

      // Arahkan ke dashboard
      console.log('Attempting to redirect to dashboard...');
      router.push('/student/dashboard');
    }
  } catch (error) {
    console.error('Login error:', error);
    errorMessage.value = error.response?.data?.message || 'Login failed. Please check your credentials.';
  }
};

const handleGoogleLogin = async () => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
  } catch (error) {
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="bg-white shadow-xl rounded-lg max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2">
      <!-- Left side - Login Form -->
      <div class="p-8">
        <img :src="ittrLogo" alt="ITTR English Logo" class="w-40 mb-6" />
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Ayo Login ke Akun kamu</h2>
        <p class="text-gray-600 mb-8">Selamat datang kembali! Silakan masukkan detail Anda.</p>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email Input -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Email</label>
            <input v-model="email" 
                   type="email" 
                   id="email"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                   placeholder="you@example.com" 
                   required />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <input v-model="password" 
                   type="password" 
                   id="password"
                   class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                   placeholder="••••••••" 
                   required />
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Error</span>
            <div>{{ errorMessage }}</div>
          </div>

          <!-- Login Button -->
          <button type="submit" 
                  class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Login
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center my-6">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink mx-4 text-gray-600">Or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Google Login Button -->
        <button @click="handleGoogleLogin" 
                class="w-full text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 inline-flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign in with Google
        </button>
      </div>

      <!-- Right side - Illustration -->
      <div class="hidden lg:flex items-center justify-center p-8 bg-gray-50 rounded-r-lg">
        <img :src="kucingterbang" alt="Ilustrasi" class="w-full max-w-xs" />
      </div>
    </div>
  </div>
</template>
