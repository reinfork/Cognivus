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
const showModal = ref(false);
const modalType = ref(''); // 'success' or 'error'
const modalMessage = ref('');

const fetchProfile = async () => {
  const userId = authStore.user?.id;
  if (!userId) {
    modalType.value = 'error';
    modalMessage.value = "User not authenticated.";
    showModal.value = true;
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiClient.get(`/students/${userId}`);
    if (response.data.success) {
      studentProfile.value = response.data.data;
    }
  } catch (error) {
    modalType.value = 'error';
    modalMessage.value = "Failed to fetch profile data.";
    showModal.value = true;
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
      modalType.value = 'success';
      modalMessage.value = "Profile updated successfully!";
      showModal.value = true;
    }
  } catch (error) {
    modalType.value = 'error';
    modalMessage.value = "Failed to update profile. Please try again.";
    showModal.value = true;
    console.error(error);
  }
};

const closeModal = () => {
  showModal.value = false;
  // Delay clearing the modal content to prevent flash during closing animation
  setTimeout(() => {
    modalType.value = '';
    modalMessage.value = '';
  }, 200);
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

    <!-- DaisyUI Modal -->
    <dialog :class="['modal', showModal ? 'modal-open' : '']" @click.self="closeModal">
      <div class="modal-box">
        <div class="flex items-center gap-3 mb-4">
          <!-- Success Icon -->
          <div v-if="modalType === 'success'" class="text-success">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <!-- Error Icon -->
          <div v-else-if="modalType === 'error'" class="text-error">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 class="text-lg font-bold">
            {{ modalType === 'success' ? 'Success' : modalType === 'error' ? 'Error' : '' }}
          </h3>
        </div>
        
        <p class="py-4">{{ modalMessage }}</p>
        
        <div class="modal-action">
          <button class="btn btn-primary" @click="closeModal">OK</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" @submit="closeModal">
        <button type="submit">close</button>
      </form>
    </dialog>
  </div>
</template>