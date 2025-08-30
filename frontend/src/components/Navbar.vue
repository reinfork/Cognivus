<script setup>
// Tidak perlu script
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm sticky top-0 z-50">
    <div class="navbar-start">
      <router-link to="/" class="btn btn-ghost text-xl">
        ITTR ENGLISH
      </router-link>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><router-link to="/">Home</router-link></li>
        <li><a>Article</a></li>
        <li><a>Programs</a></li>
        <li><a>Testimonials</a></li>
        <li><a>About Us</a></li>
      </ul>
    </div>

    <div class="navbar-end gap-3">
      <router-link to="/login" class="btn rounded-3xl btn-primary pr-5">
        Masuk
      </router-link>

      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
          <div class="w-10 rounded-full">
            <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
          </div>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
          <li><a>Profile</a></li>
          <li><a>Settings</a></li>
          <li><a>Logout</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>