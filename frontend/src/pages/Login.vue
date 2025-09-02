<script setup>
import ittrLogo from '../assets/ittrlogo.png';
import kucingterbang from '../assets/kucingterbang.png';
</script>

<template>
  <div class="min-h-screen bg-blue flex items-center justify-center p-4">
    <div class="card lg:card-side bg-base-100 shadow-2xl max-w-4xl w-full">
      <div class="card-body max-w-md mx-auto lg:mx-0">
        <img :src="ittrLogo" alt="ITTR English Logo" class="w-40 mb-4" />

        <h2 class="card-title text-3xl font-bold mb-1">Ayo Login ke Akun kamu</h2>
        <p class="text-base-content/60 mb-6">Selamat datang kembali! Silakan masukkan detail Anda.</p>

        <form class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text">Email</span>
            </label>
            <input type="email" placeholder="you@example.com" class="input input-bordered w-full" />
          </div>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Password</span>
            </label>
            <input type="password" placeholder="••••••••" class="input input-bordered w-full" />
          </div>
          <div class="form-control mt-6">
            <button class="btn btn-primary">Login</button>
          </div>
        </form>

        <div class="divider">Or</div>

        <button class="btn btn-outline w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.988,35.617,44,30.038,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Sign in with Google
        </button>
      </div>

      <figure class="p-8 hidden lg:flex items-center justify-center">
        <img :src="kucingterbang" alt="ITTR English Logo" class="w-full max-w-xs" />
      </figure>
    </div>
  </div>
</template>