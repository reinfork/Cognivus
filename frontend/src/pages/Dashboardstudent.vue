<script setup>
import { ref } from 'vue';
import gambar1 from '../assets/kucingterbang.png';

// AMBIL DARI DATABASE API! 
const user = ref({
  name: 'Dwipa',
});

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
</script>

<template>
  <div class="flex min-h-screen bg-base-200 rounded-tl-2xl">
    <aside class="w-64 flex-shrink-0 bg-base-100 p-4 shadow-lg">
      <div class="flex items-center gap-4 p-2 mb-4">
        <div class="avatar">
        </div>
        <div>
          <p class="text-sm font-semibold">Student</p>
          <h3 class="text-lg font-bold">Hi, {{ user.name }}</h3>
        </div>
      </div>
      
      <div class="divider m-0"></div>

      <ul class="menu p-2">
        <li class="menu-title">Menu</li>
        <li><a>Dashboard</a></li>
        <li><a>My Classes</a></li>
        <li><a>Calendar</a></li>
        <li><a>Goals</a></li>
        <li><router-link to="/profile">My Profile</router-link></li>
      </ul>
    </aside>

    <main class="flex-1 p-6 lg:p-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="stat in stats" :key="stat.title" class="card bg-base-100 shadow">
          <div class="card-body">
            <p class="text-sm text-base-content/70">{{ stat.title }}</p>
            <p class="text-3xl font-bold">{{ stat.value }}</p>
          </div>
        </div>
      </div>

      <div>
        <div class="flex flex-col sm:flex-row justify-between items-center mb-4">
          <h2 class="text-2xl font-bold mb-4 sm:mb-0">My Classes</h2>
          <div class="form-control w-full sm:w-auto">
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="cls in myClasses" :key="cls.title" class="card bg-base-100 shadow-xl transition-transform transform hover:-translate-y-1">
            <figure><img :src="cls.image" :alt="cls.title" class="h-48 w-full object-cover" /></figure>
            <div class="card-body">
              <h3 class="card-title">
                {{ cls.title }}
              </h3>
              <p class="text-base-content/80 text-sm mt-1">{{ cls.description }}</p>
              <div class="my-4">
              </div>

              <div class="card-actions justify-end">
                <button class="btn btn-primary">Open Class</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>