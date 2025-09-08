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
      // Default child route for /student
      {
        path: '',
        redirect: { name: 'StudentDashboard' }
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
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated: authStore.isAuthenticated(),
    tokenExpired: authStore.isTokenExpired(),
    currentTime: new Date().toLocaleString()
  });

  // Only check authentication for routes that require it
  if (to.meta.requiresAuth) {
    // Check token expiration
    if (authStore.isTokenExpired() && authStore.token) {
      console.log('Token expired, clearing auth and redirecting to login');
      authStore.clearAuth();
      next({ name: 'Login' });
      return;
    }
    
    // Check if authenticated
    if (!authStore.isAuthenticated()) {
      console.log('Not authenticated, redirecting to login');
      next({ name: 'Login' });
      return;
    }
  }

  // Redirect authenticated users from login/home to dashboard
  if (authStore.isAuthenticated() && (to.path === '/' || to.path === '/login')) {
    console.log('Redirecting authenticated user to dashboard');
    next('/student/dashboard');
    return;
  }

  // Allow navigation
  console.log('Allowing navigation to:', to.path);
  next();
});

export default router;
