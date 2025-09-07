<script setup>
import { ref, onMounted } from 'vue';
import { authStore } from '../../store/auth';
import apiClient from '../../services/api';
import gambar1 from '../../assets/kucingterbang.png';

// Reactive variables for student data
const studentProfile = ref(null);
const isLoading = ref(true);

// AMBIL DARI DATABASE API!
const user = ref({
  name: 'Student', // Default fallback
});

// Function to get time-based greeting
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return 'Good Morning';
  } else if (hour >= 12 && hour < 17) {
    return 'Good Afternoon';
  } else if (hour >= 17 && hour < 21) {
    return 'Good Evening';
  } else {
    return 'Good Night';
  }
};

const greeting = ref(getGreeting());

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
  <!-- Welcome Section with Integrated Stats -->
  <div class="bg-gradient-to-r from-blue-50 to-indigo-100 rounded-2xl p-8 mb-8 shadow-sm">
    <div class="flex flex-col lg:flex-row items-start gap-8">
      <!-- Welcome Message -->
      <div class="flex-1 lg:flex-2">
        <h1 class="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{{ greeting }},</h1>
        <h2 class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">{{ user.name }}</h2>
        <p class="text-gray-600 flex items-center text-lg">
          After today's efforts, rest and improve your abilities 
          <span class="ml-2">💪</span>
        </p>
      </div>

      <!-- Quick Stats Grid -->
      <div class="lg:flex-1">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div v-for="stat in stats" :key="stat.title" class="bg-white/70 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/90 transition-all duration-200 hover:scale-105">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path v-if="stat.title === 'Active Classes'" fill-rule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v6.586l-1.293-1.293a1 1 0 00-1.414 1.414L16 16.414V18a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h2zM8 5a1 1 0 011-1h2a1 1 0 011 1v1H8V5zM6 8a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z" clip-rule="evenodd"></path>
                  <path v-else-if="stat.title === 'Next Session'" fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                  <path v-else fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <p class="text-sm font-medium text-gray-500 mb-1">{{ stat.title }}</p>
                <p class="text-lg font-bold text-gray-900">{{ stat.value }}</p>
              </div>
            </div>
          </div>
          
          <!-- Add a fourth card for balance -->
          <div class="bg-white/40 backdrop-blur-sm border border-white/20 rounded-xl p-4 hover:bg-white/60 transition-all duration-200 cursor-pointer group">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 bg-gradient-to-r from-gray-300 to-gray-400 rounded-xl flex items-center justify-center shadow-md group-hover:from-blue-400 group-hover:to-indigo-400 transition-all duration-200 flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"></path>
                </svg>
              </div>
              <div class="flex-1 text-left">
                <p class="text-sm font-medium text-gray-400 mb-1 group-hover:text-gray-600 transition-colors">Quick Actions</p>
                <p class="text-lg font-bold text-gray-400 group-hover:text-gray-600 transition-colors">+</p>
              </div>
            </div>
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
</template>
