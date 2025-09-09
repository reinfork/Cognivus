<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../store/auth';
import apiClient from '../services/api';
import { supabase } from '../supabase';
import ittrLogo from '../assets/ittrlogo.png';
import kucingterbang from '../assets/kucingterbang.png';

// Modal state
const showModal = ref(false);
const modalType = ref('info'); // 'info', 'success', 'error'
const modalTitle = ref('');
const modalMessage = ref('');

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const router = useRouter();

// Modal functions
const openModal = (type, title, message) => {
  modalType.value = type;
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = 'info';
  modalTitle.value = '';
  modalMessage.value = '';
};

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

      // Show success modal
      openModal('success', 'Login Berhasil!', 'Selamat datang! Anda akan diarahkan ke dashboard.');
      
      // Redirect after a short delay
      setTimeout(() => {
        closeModal();
        router.push('/student/dashboard');
      }, 2000);
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorMsg = error.response?.data?.message || 'Login failed. Please check your credentials.';
    errorMessage.value = errorMsg;
    openModal('error', 'Login Gagal', errorMsg);
  }
};

const handleGoogleLogin = async () => {
  try {
    openModal('info', 'Menghubungkan...', 'Sedang menghubungkan dengan Google. Mohon tunggu...');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });
    if (error) throw error;
    closeModal();
  } catch (error) {
    errorMessage.value = error.message;
    openModal('error', 'Google Login Gagal', error.message);
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-cyan-400 flex items-center justify-center p-4">
    <div class="bg-white shadow-2xl rounded-3xl max-w-6xl w-full grid grid-cols-1 lg:grid-cols-5 overflow-hidden">
      <!-- Left side - Login Form (2 columns) -->
      <div class="lg:col-span-2 p-8 flex items-center justify-center">
        <div class="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 w-full max-w-md">
          <img :src="ittrLogo" alt="ITTR English Logo" class="w-40 mb-6 mx-auto" />
          <h2 class="text-2xl font-bold text-gray-900 mb-2 text-center">Hi, Welcome</h2>
          <p class="text-gray-600 mb-6 text-center text-sm">Please complete the data in the blank columns</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <!-- Email Input -->
          <div>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">Username</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <input v-model="email" 
                     type="email" 
                     id="email"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
                     placeholder="Username" 
                     required />
            </div>
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block mb-2 text-sm font-medium text-gray-900">Password</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg class="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <input v-model="password" 
                     type="password" 
                     id="password"
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" 
                     placeholder="Password" 
                     required />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="flex items-center p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
            <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
            </svg>
            <span class="sr-only">Error</span>
            <div>{{ errorMessage }}</div>
          </div>

          <!-- Login Button -->
          <button type="submit" 
                  class="w-full text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center">
            Login
          </button>
        </form>

        <!-- Divider -->
        <div class="flex items-center my-4">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink mx-4 text-gray-500 text-sm">Or</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Google Login Button -->
        <button @click="handleGoogleLogin" 
                class="w-full text-gray-700 bg-white border border-gray-300 focus:outline-none hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center justify-center">
          <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign In With Google
        </button>

        <!-- Footer text -->
        <div class="mt-6 text-center">
          <p class="text-xs text-gray-500">
            Butuh informasi lebih lanjut? 
            <a href="#" class="text-blue-600 hover:underline">WhatsApp</a> atau 
            <a href="#" class="text-blue-600 hover:underline">Email</a>
          </p>
          <p class="text-xs text-gray-400 mt-2">2024 ITTR English Course. All right reserved</p>
        </div>
        </div>
      </div>

      <!-- Right side - Illustration (3 columns) -->
      <div class="lg:col-span-3 hidden lg:flex items-center justify-center p-12 bg-gradient-to-br from-blue-50 to-indigo-100">
        <img :src="kucingterbang" alt="Ilustrasi" class="w-full max-w-2xl" />
      </div>
    </div>

    <!-- Modal Component -->
    <div v-if="showModal" 
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
         @click.self="closeModal">
      <div class="relative w-full max-w-md max-h-full">
        <!-- Modal content -->
        <div class="relative bg-white rounded-lg shadow-lg">
          <!-- Modal header -->
          <div class="flex items-start justify-between p-4 border-b rounded-t">
            <div class="flex items-center space-x-3">
              <!-- Success Icon -->
              <div v-if="modalType === 'success'" class="flex-shrink-0">
                <div class="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              </div>
              
              <!-- Error Icon -->
              <div v-else-if="modalType === 'error'" class="flex-shrink-0">
                <div class="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
                  <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              </div>

              <!-- Info Icon -->
              <div v-else class="flex-shrink-0">
                <div class="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                  <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900">
                {{ modalTitle }}
              </h3>
            </div>
            
            <button @click="closeModal" 
                    type="button" 
                    class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center">
              <svg class="w-3 h-3" fill="none" viewBox="0 0 14 14">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
              </svg>
            </button>
          </div>
          
          <!-- Modal body -->
          <div class="p-6">
            <p class="text-base text-gray-700">
              {{ modalMessage }}
            </p>
          </div>
          
          <!-- Modal footer -->
          <div class="flex justify-end p-6 border-t border-gray-200 rounded-b">
            <button @click="closeModal" 
                    type="button" 
                    :class="[
                      'font-medium rounded-lg text-sm px-5 py-2.5 text-center',
                      modalType === 'success' ? 'text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300' :
                      modalType === 'error' ? 'text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300' :
                      'text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300'
                    ]">
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
