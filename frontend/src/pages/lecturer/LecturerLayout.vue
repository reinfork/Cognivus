<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = () => {
  // Tambahkan logika logout Anda di sini
  console.log('Lecturer logged out');
  router.push('/login'); // Arahkan ke halaman login umum
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-gray-100">
    <header class="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 class="text-xl font-bold">Lecturer Portal</h1>
      <button @click="handleLogout" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
        Logout
      </button>
    </header>

    <div class="flex flex-1">
      <aside class="w-64 bg-gray-800 text-white p-4">
        <nav>
          <ul>
            <li>
              <router-link to="/lecturer/dashboard" class="block py-2 px-4 rounded hover:bg-gray-700">
                Dashboard
              </router-link>
            </li>
            </ul>
        </nav>
      </aside>

      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>