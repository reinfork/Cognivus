<script setup>
import { computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../../store/auth';
import { useStudentProfile } from '../../composables/useStudentProfile';

const router = useRouter();
const { studentProfile, isLoading: isProfileLoading } = useStudentProfile();

const displayName = computed(() => {
  return studentProfile.value?.nama_lengkap || authStore.user?.email?.split('@')[0] || 'Student';
});

const handleAvatarError = (event) => {
  event.target.src = '/src/assets/kucingterbang.png';
};

const handleLogout = async () => {
  authStore.clearAuth();
  router.push('/login');
};

onUnmounted(() => {
  console.log('Unmounting StudentLayout.vue');
});
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="header-glass backdrop-blur-lg bg-gradient-to-r from-white via-blue-50 to-indigo-100 shadow-lg border-b border-white/20 sticky top-0 z-20">
      <div class="flex items-center justify-between px-6 py-4">
        <!-- Left: ITTR Logo -->
        <div class="flex items-center">
          <img src="/src/assets/ittrlogo.png" alt="ITTR Logo" class="h-10 w-auto object-contain" />
        </div>

        <!-- Right: Notifications and User Profile -->
        <div class="flex items-center gap-4">
          <!-- Notification Bell -->
          <button class="h-12 w-12 flex items-center justify-center rounded-lg bg-white/30 backdrop-blur-sm border border-white/50 hover:bg-white/40 transition-all duration-200 shadow-sm">
            <svg class="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
            </svg>
          </button>

          <!-- User Profile Section -->
          <div class="flex items-center gap-3 h-12 px-4 rounded-lg bg-white/30 backdrop-blur-sm border border-white/50 shadow-sm">
            <div class="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white/50">
              <!-- Skeleton while avatar loading -->
              <div v-if="isProfileLoading" class="avatar-skeleton bg-blue-100 w-full h-full rounded-full"></div>

              <!-- Avatar image -->
              <img v-else :src="authStore.user?.user_metadata?.avatar_url || '/src/assets/kucingterbang.png'"
                :alt="displayName" class="w-full h-full object-cover rounded-full" @error="handleAvatarError" />
            </div>
            <div class="text-left">
              <p class="text-xs font-semibold text-gray-600">Student</p>
              <h3 class="text-lg font-medium text-gray-800">{{ displayName }}</h3>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex flex-1 relative">
      <!-- Desktop Sidebar -->
      <aside class="sidebar group w-19 hover:w-40 flex-shrink-0 sidebar-glass shadow-2xl transition-all duration-250 ease-in-out overflow-hidden fixed left-4 top-28 bottom-5 rounded-2xl z-10 border border-white/20 hidden md:block">
        <!-- Navigation Menu -->
        <nav class="p-4 h-full overflow-y-auto">
          <p class="sidebar-text text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 opacity-0 whitespace-nowrap overflow-hidden">
            Menu
          </p>
          <ul class="space-y-2">
            <li>
              <router-link to="/student/dashboard"
                class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 group">
                <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
                <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Dashboard</span>
              </router-link>
            </li>
            <li>
              <a href="#" class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 group">
                <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Courses</span>
              </a>
            </li>
            <li>
              <router-link to="/student/profile-view"
                class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-blue-600 group">
                <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">View Profile</span>
              </router-link>
            </li>
            <li>
              <a @click="handleLogout"
                class="nav-item flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:text-red-600 cursor-pointer group">
                <svg class="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
                </svg>
                <span class="sidebar-text ml-3 opacity-0 whitespace-nowrap overflow-hidden">Logout</span>
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Mobile Bottom Navigation -->
      <nav class="mobile-nav fixed bottom-0 left-0 right-0 h-16 bg-transparent md:hidden z-50">
        <div class="mobile-nav-glass h-full mx-4 mb-4 rounded-2xl">
          <ul class="h-full flex justify-around items-center px-6">
            <li>
              <router-link to="/student/dashboard" class="mobile-nav-item flex flex-col items-center gap-1">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                </svg>
                <span class="text-xs">Dashboard</span>
              </router-link>
            </li>
            <li>
              <a href="#" class="mobile-nav-item flex flex-col items-center gap-1">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-xs">Courses</span>
              </a>
            </li>
            <li>
              <router-link to="/student/profile-view" class="mobile-nav-item flex flex-col items-center gap-1">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs">Profile</span>
              </router-link>
            </li>
            <li>
              <a @click="handleLogout" class="mobile-nav-item flex flex-col items-center gap-1">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-xs">Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <!-- Main Content Area - This is where child routes will render -->
      <main class="flex-1 p-6 lg:p-8 overflow-auto md:ml-20 mb-20 md:mb-0">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
/* Header glassmorphism effect */
.header-glass {
  background: linear-gradient(135deg, #ffffffe6, #dbebffcc, rgba(199, 210, 254, 0.7));
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: 0 0 16px 16px;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Sidebar glassmorphism effect */
.sidebar-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(240, 249, 255, 0.8), rgba(224, 242, 254, 0.75));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 
    0 25px 45px rgba(31, 41, 55, 0.1),
    0 8px 32px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

/* Sidebar hover animations */
.sidebar {
  transition: width 300ms ease-in-out, transform 200ms ease, box-shadow 300ms ease;
}

.sidebar:hover {
  width: 16rem;
  transform: translateY(-2px);
  box-shadow: 
    0 35px 60px rgba(31, 41, 55, 0.15),
    0 12px 40px rgba(59, 130, 246, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

/* Avatar animations and skeleton */
.avatar-container {
  transition: transform 200ms ease, box-shadow 200ms ease;
}

.sidebar:hover .avatar-container {
  transform: scale(1.12);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.12);
}

.avatar-skeleton {
  animation: pulse 1.2s infinite ease-in-out;
}

.avatar-img {
  transition: opacity 200ms ease;
}



@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.6;
  }

  100% {
    opacity: 1;
  }
}

.sidebar:hover .sidebar-text {
  opacity: 1;
  transition: opacity 300ms ease-in-out 150ms;
  /* Delay text appearance */
}

.sidebar-text {
  transition: opacity 300ms ease-in-out;
}

/* Ensure icons stay in place */
.nav-item svg {
  min-width: 1.25rem;
  /* w-5 */
}

/* Smooth hover effects for nav items */
.nav-item {
  transition: all 200ms ease-in-out;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(8px);
  transform: translateX(4px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

/* Optional: Add a subtle indicator when sidebar is expandable */
.sidebar::after {
  content: '';
  position: absolute;
  right: -1px;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 30px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.3), rgba(147, 197, 253, 0.3));
  border-radius: 0 4px 4px 0;
  opacity: 0;
  transition: opacity 200ms ease-in-out;
}

.sidebar:hover::after {
  opacity: 1;
}

/* Mobile navigation styles */
.mobile-nav-glass {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(240, 249, 255, 0.8), rgba(224, 242, 254, 0.75));
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 
    0 -8px 32px rgba(31, 41, 55, 0.1),
    0 -4px 16px rgba(59, 130, 246, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.mobile-nav-item {
  color: #374151; /* text-gray-700 */
  transition: color 0.2s ease;
  position: relative;
}

.mobile-nav-item.router-link-active {
  color: #2563eb; /* text-blue-600 */
}

.mobile-nav-item:hover {
  color: #2563eb; /* text-blue-600 */
}

.mobile-nav-item::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: currentColor;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.mobile-nav-item.router-link-active::after {
  opacity: 1;
}
</style>
