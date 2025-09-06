<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authStore } from '../store/auth';
import apiClient from '../services/api';
import gambar1 from '../assets/kucingterbang.png';

const router = useRouter();

// Reactive variables for student data
const studentProfile = ref(null);
const isLoading = ref(true);

// AMBIL DARI DATABASE API!
const user = ref({
  name: 'Student', // Default fallback
});

// Function to fetch student profile
const fetchStudentProfile = async () => {
  const userId = authStore.user?.id;
  if (!userId) {
    isLoading.value = false;
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
  }
};

const handleLogout = async () => {
  authStore.clearAuth();
  router.push('/login');
};

const stats = ref([
  { title: 'Active Classes', value: '1' },
  { title: 'Next Session', value: 'Wed 04:00 PM' },
  { title: 'This Week', value: '4 classes' }
]);


//bagian my classes ini harusnya nanti ambil dari databasesnya,
// jadi nanti envnya harus sama dan juga namanya harus sama dengan yang di database
const myClasses = ref([
  {
    title: 'Grammar Essentials',
    description: 'Master the basics starting from tenses, sentence structure, and common patterns to build strong foundations.',
    nextSession: 'Wed, Sep 3, 04:00 PM',
    image: gambar1
  },
  {
    title: 'Speaking & Conversation',
    description: 'Boost confidence with dialogues, role-plays, and real-life speaking practice.',
    nextSession: 'Thu, Sep 4, 06:30 PM',
    image: 'https://media1.tenor.com/m/L1DyVjuyLqEAAAAd/uma-musume-dance.gif'
  },
  {
    title: 'IELTS Prep',
    description: 'Targeted strategies for Listening, Reading, Writing, and Speaking — with practice tests.',
    nextSession: 'Fri, Sep 5, 07:00 PM',
    image: 'https://media1.tenor.com/m/wdgDOrbSkiwAAAAd/satono-diamond-diamond-satono.gif'
  }
]);

// Fetch student profile on component mount
onMounted(fetchStudentProfile);
</script>

<template>
  <div class="flex min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <aside class="w-64 flex-shrink-0 bg-white shadow-lg">
      <!-- User Profile Section -->
      <div class="flex items-center gap-4 p-4 border-b border-gray-200">
        <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
          </svg>
        </div>
        <div>
          <p class="text-sm font-medium text-gray-500">Student</p>
          <h3 class="text-lg font-bold text-gray-900">Hi, {{ user.name }}</h3>
        </div>
      </div>

      <!-- Navigation Menu -->
      <nav class="p-4">
        <p class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Menu</p>
        <ul class="space-y-2">
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              My Classes
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
              </svg>
              Calendar
            </a>
          </li>
          <li>
            <a href="#" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clip-rule="evenodd"></path>
              </svg>
              Goals
            </a>
          </li>
          <li>
            <router-link to="/profile-view" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
              </svg>
              View Profile
            </router-link>
          </li>
          <li>
            <router-link to="/profile" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
              </svg>
              Edit Profile
            </router-link>
          </li>
          <li>
            <a @click="handleLogout" class="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 cursor-pointer">
              <svg class="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"></path>
              </svg>
              Logout
            </a>
          </li>
        </ul>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-6 lg:p-8">
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.title" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="p-5">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <div class="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                </div>
              </div>
              <div class="ml-5 w-0 flex-1">
                <dl>
                  <dt class="text-sm font-medium text-gray-500 truncate">{{ stat.title }}</dt>
                  <dd class="text-lg font-medium text-gray-900">{{ stat.value }}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Classes Section -->
      <div>
        <div class="flex flex-col sm:flex-row justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4 sm:mb-0">My Classes</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="cls in myClasses" :key="cls.title" class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img class="rounded-t-lg h-48 w-full object-cover" :src="cls.image" :alt="cls.title" />
            <div class="p-5">
              <h5 class="mb-2 text-xl font-bold tracking-tight text-gray-900">{{ cls.title }}</h5>
              <p class="mb-3 font-normal text-gray-700 text-sm">{{ cls.description }}</p>
              <div class="flex items-center justify-between">
                <span class="text-sm text-gray-500">{{ cls.nextSession }}</span>
                <button class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300">
                  Open Class
                  <svg class="w-3.5 h-3.5 ml-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
