<script setup>
// Navbar is presentational; logic handled in layout pages
</script>

<template>
  <nav class="header-glass sticky top-0 z-50">
    <div class="max-w-screen-xl flex items-center justify-between mx-auto p-4">
      <!-- Left: Mobile menu button + Logo + Desktop Links -->
      <div class="flex items-center gap-4">
        <!-- Mobile menu button (left of logo) -->
        <button data-collapse-toggle="navbar-default" type="button" 
                class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" 
                aria-controls="navbar-default" aria-expanded="false">
          <span class="sr-only">Open main menu</span>
          <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
          </svg>
        </button>

        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/src/assets/ittrlogo.png" alt="ITTR" class="h-8 w-auto object-contain" />
        </router-link>

        <!-- Desktop Links -->
        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm">Home</router-link>
          <a href="#" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm">Article</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm">Programs</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm">Testimonials</a>
          <a href="#" class="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm">About Us</a>
        </div>
      </div>



      <!-- Right side: Masuk button + Avatar -->
      <div class="flex items-center gap-3">
        <router-link to="/login" 
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center">
          Masuk
        </router-link>

        <!-- Avatar dropdown (kept minimal) -->
        <div class="relative hidden md:block">
          <button id="dropdownUserAvatarButton" data-dropdown-toggle="dropdownAvatar" 
                  class="flex text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300" type="button">
            <span class="sr-only">Open user menu</span>
            <img class="w-8 h-8 rounded-full" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="user photo">
          </button>
          <div id="dropdownAvatar" class="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44">
            <div class="px-4 py-3 text-sm text-gray-900">
              <div>Bonnie Green</div>
              <div class="font-medium truncate">name@flowbite.com</div>
            </div>
            <ul class="py-2 text-sm text-gray-700" aria-labelledby="dropdownUserAvatarButton">
              <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100">Profile</a>
              </li>
              <li>
                <a href="#" class="block px-4 py-2 hover:bg-gray-100">Settings</a>
              </li>
            </ul>
            <div class="py-1">
              <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Collapsible mobile nav (Flowbite will toggle this) -->
    <div class="md:hidden hidden" id="navbar-default">
      <ul class="px-4 pb-4 space-y-2 bg-white/40 backdrop-blur-sm">
        <li><router-link to="/" class="block py-2 px-3 text-gray-700">Home</router-link></li>
        <li><a href="#" class="block py-2 px-3 text-gray-700">Article</a></li>
        <li><a href="#" class="block py-2 px-3 text-gray-700">Programs</a></li>
        <li><a href="#" class="block py-2 px-3 text-gray-700">Testimonials</a></li>
        <li><a href="#" class="block py-2 px-3 text-gray-700">About Us</a></li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
/* Reuse header glassmorphism from StudentLayout */
.header-glass {
  background: linear-gradient(135deg, #ffffffe6, #dbebffcc, rgba(199, 210, 254, 0.7));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

/* Slightly smaller shadow for navbar */
nav.header-glass {
  border-radius: 12px;
  margin: 8px;
}

/* Mobile collapsible background tweak */
.header-glass #navbar-default {
  margin-top: 4px;
}
</style>