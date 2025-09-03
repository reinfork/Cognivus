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
    const response = await apiClient.post('/auth/login', {
      email: email.value,
      password: password.value,
    });

    if (response.data.success) {
      // Ambil user dan token dari respons
      const { user, session } = response.data;
      // Simpan di state management
      authStore.setAuth(user, session.access_token);
      // Arahkan ke dashboard
      router.push('/dashboardstudent');
    }
  } catch (error) {
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
  <div class="min-h-screen bg-white-200 flex items-center justify-center p-4">
    <div class="card lg:card-side bg-base-100 shadow-2xl max-w-4xl w-full">
      <div class="card-body max-w-md mx-auto lg:mx-0">
        <img :src="ittrLogo" alt="ITTR English Logo" class="w-40 mb-4" />
        <h2 class="card-title text-3xl font-bold mb-1">Ayo Login ke Akun kamu</h2>
        <p class="text-base-content/60 mb-6">Selamat datang kembali! Silakan masukkan detail Anda.</p>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label"><span class="label-text">Email</span></label>
            <input v-model="email" type="email" placeholder="you@example.com" class="input input-bordered w-full"
              required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Password</span></label>
            <input v-model="password" type="password" placeholder="••••••••" class="input input-bordered w-full"
              required />
          </div>

          <div v-if="errorMessage" class="text-error text-sm">
            {{ errorMessage }}
          </div>

          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary">Login</button>
          </div>
        </form>

        <div class="divider">Or</div>

        <button @click="handleGoogleLogin" class="btn btn-outline w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
          </svg>
          Sign in with Google
        </button>
      </div>

      <figure class="p-8 hidden md:flex items-center justify-center">
        <img :src="kucingterbang" alt="Ilustrasi" class="w-full max-w-xs" />
      </figure>
    </div>
  </div>
</template>