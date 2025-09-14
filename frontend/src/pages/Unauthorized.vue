<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-blue-50 text-center p-4">
    <div class="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full">
      <h1 class="text-6xl font-bold text-red-500 mb-4">403</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Access Denied</h2>
      <p class="text-gray-600 mb-8">Sorry, you don't have permission to access this page.</p>
      <button @click="goBack" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
        Go Back
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goBack = () => {
  router.back();
};
</script>
