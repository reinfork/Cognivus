<script setup>
import { ref, onMounted, nextTick } from 'vue';
import apiClient from '../../services/api';
import { authStore } from '../../store/auth';

const studentProfile = ref({
  id: null,
  nama_lengkap: '',
  jenis_kelamin: '',
  alamat: '',
  no_hp: '',
  nama_ortu: '',
  no_hp_ortu: '',
  user_id: null,
});

const isLoading = ref(true);
const showModal = ref(false);
const modalType = ref(''); // 'success' or 'error'
const modalMessage = ref('');
const modalRef = ref(null);

const fetchProfile = async () => {
  const userId = authStore.user?.id;
  if (!userId) {
    modalType.value = 'error';
    modalMessage.value = "User not authenticated.";
    openModal();
    isLoading.value = false;
    return;
  }

  try {
    const response = await apiClient.get(`/students/${userId}`);
    if (response.data.success) {
      console.log('Student profile data:', response.data.data);
      // Log all keys in the student data to see what's available
      console.log('Available fields:', Object.keys(response.data.data));
      studentProfile.value = response.data.data;
    }
  } catch (error) {
    modalType.value = 'error';
    modalMessage.value = "Failed to fetch profile data.";
    openModal();
    console.error(error);
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateProfile = async () => {
  try {
    // Get the user ID from the student profile or the auth store
    const userId = studentProfile.value.user_id || authStore.user?.id;
    
    if (!userId) {
      console.error('Error: User ID not found');
      modalType.value = 'error';
      modalMessage.value = "Cannot update profile: User ID not found. Please reload the page.";
      openModal();
      return;
    }
    
    console.log('Updating student profile with user ID:', userId);
    
    const response = await apiClient.put(`/students/${userId}`, studentProfile.value);
    if (response.data.success) {
      modalType.value = 'success';
      modalMessage.value = "Profile updated successfully!";
      openModal();
    }
  } catch (error) {
    console.error('Update error:', error);
    modalType.value = 'error';
    modalMessage.value = "Failed to update profile. Please try again.";
    openModal();
  }
};

const openModal = async () => {
  showModal.value = true;
  await nextTick();
  // Focus management for accessibility
  if (modalRef.value) {
    modalRef.value.focus();
  }
};

const closeModal = () => {
  showModal.value = false;
  modalType.value = '';
  modalMessage.value = '';
};

onMounted(fetchProfile);
</script>

<template>
  <div>
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Edit My Profile</h1>

    <div v-if="isLoading" class="text-center">
      <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
    </div>

    <div v-else class="max-w-4xl bg-white shadow-xl rounded-lg">
      <div class="p-6">
        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nama Lengkap -->
            <div>
              <label for="nama_lengkap" class="block mb-2 text-sm font-medium text-gray-900">Nama Lengkap</label>
              <input v-model="studentProfile.nama_lengkap" type="text" id="nama_lengkap" 
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     placeholder="Nama Lengkap" />
            </div>
            
            <!-- Jenis Kelamin -->
            <div>
              <label for="jenis_kelamin" class="block mb-2 text-sm font-medium text-gray-900">Jenis Kelamin</label>
              <select v-model="studentProfile.jenis_kelamin" id="jenis_kelamin" 
                      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5">
                <option value="" disabled>Pilih Jenis Kelamin</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <!-- Nomor HP -->
            <div>
              <label for="no_hp" class="block mb-2 text-sm font-medium text-gray-900">Nomor HP</label>
              <input v-model="studentProfile.no_hp" type="tel" id="no_hp" 
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     placeholder="08xxxxxxxxxx" />
            </div>

            <!-- Nama Orang Tua -->
            <div>
              <label for="nama_ortu" class="block mb-2 text-sm font-medium text-gray-900">Nama Orang Tua</label>
              <input v-model="studentProfile.nama_ortu" type="text" id="nama_ortu" 
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     placeholder="Nama Orang Tua" />
            </div>

            <!-- Alamat -->
            <div class="md:col-span-2">
              <label for="alamat" class="block mb-2 text-sm font-medium text-gray-900">Alamat</label>
              <textarea v-model="studentProfile.alamat" id="alamat" rows="4" 
                        class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                        placeholder="Alamat lengkap"></textarea>
            </div>

            <!-- Nomor HP Orang Tua -->
            <div>
              <label for="no_hp_ortu" class="block mb-2 text-sm font-medium text-gray-900">Nomor HP Orang Tua</label>
              <input v-model="studentProfile.no_hp_ortu" type="tel" id="no_hp_ortu" 
                     class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" 
                     placeholder="08xxxxxxxxxx" />
            </div>
          </div>
          
          <div class="flex justify-end mt-6">
            <button type="submit" 
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Flowbite Modal with Transparency and Animations -->
    <transition name="fade" appear>
      <div v-if="showModal"
         id="profile-modal"
         tabindex="-1" 
         aria-hidden="true" 
         class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent backdrop-blur-sm"
         @click.self="closeModal">
      
      <!-- Modal content -->
      <div class="relative w-full max-w-md max-h-full bg-white bg-opacity-90 backdrop-blur-md rounded-lg shadow-2xl border border-white border-opacity-20">
        
        <!-- Modal header -->
        <div class="flex items-start justify-between p-6 border-b border-gray-200 border-opacity-30 rounded-t">
          <div class="flex items-center space-x-3">
            <!-- Success Icon -->
            <div v-if="modalType === 'success'" class="flex-shrink-0">
              <div class="flex items-center justify-center w-10 h-10 bg-green-100 bg-opacity-80 rounded-full">
                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
            </div>
            
            <!-- Error Icon -->
            <div v-else-if="modalType === 'error'" class="flex-shrink-0">
              <div class="flex items-center justify-center w-10 h-10 bg-red-100 bg-opacity-80 rounded-full">
                <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            
            <div>
              <h3 class="text-lg font-semibold text-gray-900">
                {{ modalType === 'success' ? 'Success!' : 'Error!' }}
              </h3>
            </div>
          </div>
          
          <button @click="closeModal" 
                  type="button" 
                  class="text-gray-400 bg-transparent hover:bg-gray-200 hover:bg-opacity-50 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center transition-all duration-200">
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
        <div class="flex justify-end p-6 border-t border-gray-200 border-opacity-30 rounded-b">
          <button @click="closeModal" 
                  type="button" 
                  class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            OK
          </button>
        </div>
      </div>
    </div>
  </transition>
  </div>
</template>

<style scoped>
/* Vue Transition Classes for Modal */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

/* Backdrop animations */
.modal-backdrop {
  transition: all 0.3s ease-out;
}

.modal-enter-from .modal-backdrop {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.modal-leave-to .modal-backdrop {
  opacity: 0;
  backdrop-filter: blur(0px);
}

/* Content animations */
.modal-content {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-enter-from .modal-content {
  opacity: 0;
  transform: scale(0.8) translateY(-20px);
}

.modal-leave-to .modal-content {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Additional smooth transitions for interactive elements */
.modal-content button {
  transition: all 0.2s ease-in-out;
}

.modal-content .bg-green-100,
.modal-content .bg-red-100 {
  transition: all 0.2s ease-in-out;
}

/* Focus states for accessibility */
.modal-content button:focus {
  outline: 2px solid rgba(59, 130, 246, 0.5);
  outline-offset: 2px;
}
</style>
