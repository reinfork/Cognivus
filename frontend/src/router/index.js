import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '../store/auth'; // <-- Impor auth store
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import Dashboardstudent from '../pages/Dashboardstudent.vue';
import Profile from '../pages/Profile.vue';
import ProfileView from '../pages/ProfileView.vue';

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
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  { 
    path: '/profile-view',
    name: 'ProfileView',
    component: ProfileView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  console.log('Router guard check:', {
    to: to.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated(),
    user: authStore.user,
    token: authStore.token ? 'present' : 'null'
  });

  if (to.meta.requiresAuth && !authStore.isAuthenticated()) {
    console.log('Redirecting to login - not authenticated');
    next({ name: 'Login' });
  } else if (authStore.isAuthenticated() && (to.path === '/' || to.path === '/login')) {
    console.log('Redirecting authenticated user to dashboard');
    next('/dashboardstudent');
  } else {
    console.log('Allowing navigation');
    next();
  }
});

export default router;
