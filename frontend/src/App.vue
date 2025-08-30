<script setup>
import Navbar from './components/Navbar.vue';
import TujuanCard from './components/TujuanCard.vue';
import Hero from './pages/Hero.vue';
</script>

<template>
    <Navbar />


    <main>
      <Hero />
      <TujuanCard />
    </main>
</template>

<style>
body {
  margin: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}
</style>