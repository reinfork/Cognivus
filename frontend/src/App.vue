<script setup>
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { supabase } from './supabase';
import { authStore } from './store/auth';
import Navbar from './components/Navbar.vue';

const noNavbarRoutes = ['Login', 'Dashboardstudent'];
const router = useRouter();

// Listener untuk memantau perubahan status otentikasi
onMounted(() => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      authStore.setAuth(session.user, session.access_token);
      // Arahkan ke dashboard
      router.push('/dashboardstudent');
    }
  });
});
</script>

<template>
  <div>
    <Navbar v-if="!noNavbarRoutes.includes($route.name)" />
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>

</style>