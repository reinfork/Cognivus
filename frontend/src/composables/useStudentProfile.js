import { ref, onMounted } from 'vue';
import apiClient from '../services/api';
import { authStore } from '../store/auth';

export function useStudentProfile() {
  const studentProfile = ref(null);
  const isLoading = ref(true);
  const errorMessage = ref('');

  const fetchStudentProfile = async () => {
    const userId = authStore.user?.id;
    if (!userId) {
      errorMessage.value = "User not authenticated. Please log in.";
      isLoading.value = false;
      return;
    }

    isLoading.value = true;
    errorMessage.value = '';
    try {
      const response = await apiClient.get(`/students/${userId}`);
      if (response.data.success) {
        studentProfile.value = response.data.data;
      } else {
        errorMessage.value = response.data.message || "Profile not found.";
      }
    } catch (error) {
      errorMessage.value = "Failed to fetch profile data. Please try again later.";
      console.error("Failed to fetch student profile:", error);
    } finally {
      isLoading.value = false;
    }
  };

  onMounted(fetchStudentProfile);

  return {
    studentProfile,
    isLoading,
    errorMessage,
    fetchStudentProfile,
  };
}
