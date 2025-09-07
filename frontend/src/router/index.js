import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '../store/auth'; // <-- Impor auth store
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import StudentLayout from '../pages/student/StudentLayout.vue';
import Dashboard from '../pages/student/Dashboard.vue';
import Profile from '../pages/student/Profile.vue';
import ProfileView from '../pages/student/ProfileView.vue';

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
  // Student routes with nested layout
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: Dashboard,
      },
      { 
        path: 'profile',
        name: 'StudentProfile',
        component: Profile,
      },
      { 
        path: 'profile-view',
        name: 'StudentProfileView',
        component: ProfileView,
      },
      // Default redirect for /student
      {
        path: '',
        redirect: '/student/dashboard'
      }
    ]
  },
  // Legacy redirects for backward compatibility
  {
    path: '/dashboardstudent',
    redirect: '/student/dashboard'
  },
  {
    path: '/profile',
    redirect: '/student/profile'
  },
  {
    path: '/profile-view',
    redirect: '/student/profile-view'
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
    next('/student/dashboard');
  } else {
    console.log('Allowing navigation');
    next();
  }
});

export default router;
