<script setup>
import Navbar from './components/Navbar.vue';
</script>

<template>
  <div>
    <Navbar v-if="$route.name !== 'Login','Dashboardstudent'" />
    
    <main>
      <router-view />
    </main>
  </div>
</template>

<style>
/* Style global bisa diletakkan di sini atau di src/style.css */
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>