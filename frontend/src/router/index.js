import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '../store/auth'; // <-- Impor auth store
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Dashboardstudent from '../pages/Dashboardstudent.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/dashboardstudent',
    name: 'Dashboardstudent',
    component: Dashboardstudent,
    meta: { requiresAuth: true } // <-- Tandai rute ini butuh otentikasi
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;