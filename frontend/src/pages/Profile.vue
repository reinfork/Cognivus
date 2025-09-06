<script setup>
import { ref, onMounted } from 'vue';
import apiClient from '../services/api';
import { authStore } from '../store/auth';

const studentProfile = ref({
  nama_lengkap: '',
  jenis_kelamin: '',
  alamat: '',
  no_hp: '',
  nama_ortu: '',
  no_hp_ortu: '',
});

const isLoading = ref(true);
const successMessage = ref('');
const errorMessage = ref('');

const fetchProfile = async () => {
  const userId = authStore.user?.id;
  if (!userId) {
    errorMessage.value = "User not authenticated.";
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiClient.get(`/students/${userId}`);
    if (response.data.success) {
      studentProfile.value = response.data.data;
    }
  } catch (error) {
    errorMessage.value = "Failed to fetch profile data.";
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};


const handleUpdateProfile = async () => {
  successMessage.value = '';
  errorMessage.value = '';
  const userId = authStore.user?.id;

  try {
    const response = await apiClient.put(`/students/${userId}`, studentProfile.value);
    if (response.data.success) {
      successMessage.value = "Profile updated successfully!";
    }
  } catch (error) {
    errorMessage.value = "Failed to update profile.";
    console.error(error);
  }
};


onMounted(fetchProfile);
</script>

<template>
  <div class="p-6 lg:p-8 bg-base-200 min-h-screen">
    <h1 class="text-3xl font-bold mb-6">Edit My Profile</h1>

    <div v-if="isLoading" class="text-center">
      <span class="loading loading-lg"></span>
    </div>

    <div v-else class="max-w-4xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        <form @submit.prevent="handleUpdateProfile" class="space-y-4">
          
          <div v-if="successMessage" class="alert alert-success">
            <span>{{ successMessage }}</span>
          </div>
          <div v-if="errorMessage" class="alert alert-error">
            <span>{{ errorMessage }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="form-control">
              <label class="label"><span class="label-text">Nama Lengkap</span></label>
              <input v-model="studentProfile.nama_lengkap" type="text" placeholder="Nama Lengkap" class="input input-bordered" />
            </div>
            
            <div class="form-control">
              <label class="label"><span class="label-text">Jenis Kelamin</span></label>
              <select v-model="studentProfile.jenis_kelamin" class="select select-bordered">
                <option disabled selected value="">Pilih Jenis Kelamin</option>
                <option>Laki-laki</option>
                <option>Perempuan</option>
              </select>
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Nomor HP</span></label>
              <input v-model="studentProfile.no_hp" type="tel" placeholder="08xxxxxxxxxx" class="input input-bordered" />
            </div>

             <div class="form-control">
              <label class="label"><span class="label-text">Nama Orang Tua</span></label>
              <input v-model="studentProfile.nama_ortu" type="text" placeholder="Nama Orang Tua" class="input input-bordered" />
            </div>

            <div class="form-control md:col-span-2">
              <label class="label"><span class="label-text">Alamat</span></label>
              <textarea v-model="studentProfile.alamat" class="textarea textarea-bordered h-24" placeholder="Alamat lengkap"></textarea>
            </div>

            <div class="form-control">
              <label class="label"><span class="label-text">Nomor HP Orang Tua</span></label>
              <input v-model="studentProfile.no_hp_ortu" type="tel" placeholder="08xxxxxxxxxx" class="input input-bordered" />
            </div>
          </div>
          
          <div class="card-actions justify-end mt-6">
            <button type="submit" class="btn btn-primary">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>