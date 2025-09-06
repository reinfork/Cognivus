<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';
import { authStore } from '../store/auth';

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
  <div class="p-6 lg:p-8 bg-base-200 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">My Profile</h1>

    <div v-if="isLoading" class="text-center">
      <span class="loading loading-lg loading-spinner"></span>
    </div>

    <div v-else-if="errorMessage" class="alert alert-error">
      <span>{{ errorMessage }}</span>
    </div>

    <div v-else-if="studentProfile" class="max-w-4xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        <div class="space-y-4">
          <div>
            <p class="text-sm font-semibold text-base-content/60">Nama Lengkap</p>
            <p class="text-lg">{{ studentProfile.nama_lengkap || '-' }}</p>
          </div>
          <div class="divider my-1"></div>
          
          <div>
            <p class="text-sm font-semibold text-base-content/60">Jenis Kelamin</p>
            <p class="text-lg">{{ studentProfile.jenis_kelamin || '-' }}</p>
          </div>
          <div class="divider my-1"></div>

          <div>
            <p class="text-sm font-semibold text-base-content/60">Alamat</p>
            <p class="text-lg whitespace-pre-line">{{ studentProfile.alamat || '-' }}</p>
          </div>
          <div class="divider my-1"></div>

          <div>
            <p class="text-sm font-semibold text-base-content/60">Nomor HP</p>
            <p class="text-lg">{{ studentProfile.no_hp || '-' }}</p>
          </div>
          <div class="divider my-1"></div>

          <div>
            <p class="text-sm font-semibold text-base-content/60">Nama Orang Tua</p>
            <p class="text-lg">{{ studentProfile.nama_ortu || '-' }}</p>
          </div>
          <div class="divider my-1"></div>

          <div>
            <p class="text-sm font-semibold text-base-content/60">Nomor HP Orang Tua</p>
            <p class="text-lg">{{ studentProfile.no_hp_ortu || '-' }}</p>
          </div>
        </div>

        <div class="card-actions justify-end mt-6">
          <router-link to="/profile" class="btn btn-primary">
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