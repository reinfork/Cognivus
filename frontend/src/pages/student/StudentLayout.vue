<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../../store/auth';
import apiClient from '../../services/api';

const router = useRouter();

// Reactive variables for student data
const studentProfile = ref(null);
const isLoading = ref(true);
const timeRemaining = ref(null);
// Avatar loading state
const isAvatarLoading = ref(true);

// Display name computed to centralize null checks
const displayName = computed(() => {
  return studentProfile.value?.nama_lengkap || authStore.user?.email?.split('@')[0] || 'Student';
});

const handleAvatarError = (event) => {
  event.target.src = '/src/assets/kucingterbang.png';
  isAvatarLoading.value = false;
};

// AMBIL DARI DATABASE API!
const user = ref({
  name: 'Student', // Default fallback
});

// Function to update time remaining
const updateTimeRemaining = () => {
  console.log('Updating time remaining...');
  const remaining = authStore.getTimeRemaining();
  console.log('Time remaining:', remaining);
  timeRemaining.value = remaining;
};

// Set up interval for time remaining updates
let timeInterval = null;

// Function to fetch student profile
const fetchStudentProfile = async () => {
  const userId = authStore.user?.id;
  // start avatar loading state
  isAvatarLoading.value = true;
  if (!userId) {
    isLoading.value = false;
    isAvatarLoading.value = false;
    return;
  }

  try {
    const response = await apiClient.get(`/students/${userId}`);
    if (response.data.success) {
      studentProfile.value = response.data.data;
      // Update user name with database name
      user.value.name = response.data.data?.nama_lengkap || authStore.user?.email?.split('@')[0] || 'Student';
    }
  } catch (error) {
    console.error('Failed to fetch student profile:', error);
    // Fallback to email name if API fails
    user.value.name = authStore.user?.email?.split('@')[0] || 'Student';
  } finally {
    isLoading.value = false;
    // finish avatar loading
    isAvatarLoading.value = false;
  }
};

const handleLogout = async () => {
  authStore.clearAuth();
  router.push('/login');
};

// Fetch student profile on component mount
onMounted(() => {
  console.log('Mounted StudentLayout.vue');
  fetchStudentProfile();
  updateTimeRemaining();
  console.log('Starting session timer...');
  timeInterval = setInterval(() => {
    console.log('Session timer tick...');
    updateTimeRemaining();
  }, 60000);
});

onUnmounted(() => {
  console.log('Unmounting StudentLayout.vue');
  if (timeInterval) {
    console.log('Clearing session timer...');
    clearInterval(timeInterval);
  }
});
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Collapsible Sidebar -->
    <aside class="sidebar w-16 hover:w-64 flex-shrink-0 bg-white shadow-lg transition-all duration-300 ease-in-out overflow-hidden">
      <!-- User Profile Section -->
      <div class="flex items-center gap-4 p-4 border-b border-gray-200 min-h-[72px]">
        <div class="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white avatar-container">
          <!-- Skeleton while avatar loading -->
          <div v-if="isAvatarLoading" class="avatar-skeleton bg-blue-100 w-full h-full"></div>

          <!-- Avatar image -->
          <img
            v-else
            :src="authStore.user?.user_metadata?.avatar_url || '/src/assets/kucingterbang.png'"
            :alt="displayName"
            class="w-full h-full object-cover avatar-img"
            @error="handleAvatarError"
          />
        </div>
        <div class="sidebar-text opacity-0 whitespace-nowrap overflow-hidden">
          <p class="text-sm font-medium text-gray-500">Student</p>
          <h3 class="text-lg font-bold text-gray-900">Hi, {{ user.name }}</h3>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4">
        <p class="sidebar-text text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 opacity-0 whitespace-nowrap overflow-hidden">Menu</p>
        
        <!-- Session Timer -->
        <div v-if="timeRemaining" class="sidebar-text mb-4 p-2 bg-blue-50 rounded-lg opacity-0 whitespace-nowrap overflow-hidden">
          <p class="text-xs text-blue-600 font-medium">Session expires in:</p>
          <p class="text-sm font-bold text-blue-800">{{ timeRemaining.hours }}h {{ timeRemaining.minutes }}m</p>
        </div>
        
        <ul class="space-y-2">
          <li>
            <router-link to="/student/dashboard" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Dashboard</span>
            </router-link>
          </li>
          <li>
            <a href="#" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">My Classes</span>
            </a>
          </li>
          <li>
            <a href="#" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Calendar</span>
            </a>
          </li>
          <li>
            <a href="#" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Goals</span>
            </a>
          </li>
          <li>
            <router-link to="/student/profile-view" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">View Profile</span>
            </router-link>
          </li>
          <li>
            <router-link to="/student/profile" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Edit Profile</span>
            </router-link>
          </li>
          <li>
            <a @click="handleLogout" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 cursor-pointer group">
              <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
              </svg>
              <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Logout</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content Area - This is where child routes will render -->
    <main class="flex-1 p-6 lg:p-8">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
/* Sidebar hover animations */
.sidebar {
  transition: width 300ms ease-in-out;
}

.sidebar:hover {
  width: 16rem; /* 64 = w-64 */
}

/* Avatar animations and skeleton */
.avatar-container {
  transition: transform 200ms ease, box-shadow 200ms ease;
}
.sidebar:hover .avatar-container {
  transform: scale(1.12);
  box-shadow: 0 6px 12px rgba(0,0,0,0.12);
}
.avatar-skeleton {
  animation: pulse 1.2s infinite ease-in-out;
}
.avatar-img {
  transition: opacity 200ms ease;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.6; }
  100% { opacity: 1; }
}

.sidebar:hover .sidebar-text {
  opacity: 1;
  transition: opacity 300ms ease-in-out 150ms; /* Delay text appearance */
}

.sidebar-text {
  transition: opacity 300ms ease-in-out;
}

/* Ensure icons stay in place */
.nav-item svg {
  min-width: 1.25rem; /* w-5 */
}

/* Smooth hover effects for nav items */
.nav-item {
  transition: all 200ms ease-in-out;
}

/* Optional: Add a subtle indicator when sidebar is expandable */
.sidebar::after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 20px;
  background-color: #e5e7eb;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.sidebar:hover::after {
  opacity: 0;
}

/* Add a subtle shadow when expanded */
.sidebar:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
