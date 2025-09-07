<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../../services/api';
import { authStore } from '../../store/auth';

const studentProfile = ref(null);
const isLoading = ref(true);
const errorMessage = ref('');

// Fungsi untuk mengambil data profil siswa (tidak berubah)
const fetchProfile = async () => {
  const userId = authStore.user?.id;
  if (!userId) {
    errorMessage.value = "User not authenticated. Please log in.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiClient.get(`/students/${userId}`);
    if (response.data.success) {
      studentProfile.value = response.data.data;
    } else {
      errorMessage.value = response.data.message || "Profile not found.";
    }
  } catch (error) {
    errorMessage.value = "Failed to fetch profile data. Please try again later.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchProfile);
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">My Profile</h1>

    <div v-if="isLoading" class="text-center">
      <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else-if="errorMessage" class="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
      <svg class="flex-shrink-0 inline w-4 h-4 mr-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/>
      </svg>
      <span class="sr-only">Error</span>
      <div>{{ errorMessage }}</div>
    </div>

    <div v-else-if="studentProfile" class="max-w-4xl bg-white shadow-xl rounded-lg">
      <div class="p-6">
        <div class="space-y-6">
          <!-- Nama Lengkap -->
          <div class="border-b border-gray-200 pb-4">
            <dt class="text-sm font-medium text-gray-500">Nama Lengkap</dt>
            <dd class="mt-1 text-lg text-gray-900">{{ studentProfile.nama_lengkap || '-' }}</dd>
          </div>
          
          <!-- Jenis Kelamin -->
          <div class="border-b border-gray-200 pb-4">
            <dt class="text-sm font-medium text-gray-500">Jenis Kelamin</dt>
            <dd class="mt-1 text-lg text-gray-900">{{ studentProfile.jenis_kelamin || '-' }}</dd>
          </div>

          <!-- Alamat -->
          <div class="border-b border-gray-200 pb-4">
            <dt class="text-sm font-medium text-gray-500">Alamat</dt>
            <dd class="mt-1 text-lg text-gray-900 whitespace-pre-line">{{ studentProfile.alamat || '-' }}</dd>
          </div>

          <!-- Nomor HP -->
          <div class="border-b border-gray-200 pb-4">
            <dt class="text-sm font-medium text-gray-500">Nomor HP</dt>
            <dd class="mt-1 text-lg text-gray-900">{{ studentProfile.no_hp || '-' }}</dd>
          </div>

          <!-- Nama Orang Tua -->
          <div class="border-b border-gray-200 pb-4">
            <dt class="text-sm font-medium text-gray-500">Nama Orang Tua</dt>
            <dd class="mt-1 text-lg text-gray-900">{{ studentProfile.nama_ortu || '-' }}</dd>
          </div>

          <!-- Nomor HP Orang Tua -->
          <div class="pb-4">
            <dt class="text-sm font-medium text-gray-500">Nomor HP Orang Tua</dt>
            <dd class="mt-1 text-lg text-gray-900">{{ studentProfile.no_hp_ortu || '-' }}</dd>
          </div>
        </div>

        <div class="flex justify-end mt-8">
          <router-link to="/student/profile" 
                      class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
            </svg>
            Edit Profile
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Menjaga format teks pada alamat jika ada baris baru */
.whitespace-pre-line {
  white-space: pre-line;
}
</style>
