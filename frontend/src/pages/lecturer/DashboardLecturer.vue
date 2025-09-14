<script setup>
import { useRouter } from 'vue-router';
import { authStore } from '../../store/auth';

const router = useRouter();

const handleLogout = () => {
  authStore.clearAuth();
  router.push('/login');
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">Lecturer Dashboard</h1>
        <p class="mt-2 text-gray-600">Welcome to your dashboard. Here you can manage your classes and students.</p>
      </div>

      <div>
        <button @click="handleLogout" class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg focus:ring-2 focus:ring-red-300 transition-colors">
          Logout
        </button>
      </div>
    </div>
    
    <div class="mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 class="text-xl font-semibold">Quick Stats</h2>
      <p class="mt-4">You have 5 active classes.</p>
    </div>
  </div>
</template>