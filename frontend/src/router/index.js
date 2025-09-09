import { createRouter, createWebHistory } from 'vue-router';
import { authStore } from '../store/auth'; // <-- Impor auth store
import Home from '../pages/Home.vue';
import Login from '../pages/Login.vue';
import StudentLayout from '../pages/student/StudentLayout.vue';
import Dashboard from '../pages/student/Dashboard.vue';
import Profile from '../pages/student/Profile.vue';
import ProfileView from '../pages/student/ProfileView.vue';
import LecturerLayout from '../pages/lecturer/LecturerLayout.vue';
import LecturerDashboard from '../pages/lecturer/DashboardLecturer.vue';

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

   {
    path: '/lecturer',
    component: LecturerLayout,
    meta: { requiresAuth: true, role: 'lecturer' }, // Meta untuk otentikasi & peran
    children: [
      {
        path: 'dashboard',
        name: 'LecturerDashboard',
        component: LecturerDashboard,
      },
      // Default child route for /lecturer
      {
        path: '',
        redirect: { name: 'LecturerDashboard' }
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
  const isAuthenticated = authStore.isAuthenticated();
  const userRole = authStore.role || authStore.user?.role; // Get role from store or user object

  console.log('Router guard check:', {
    to: to.path,
    from: from.path,
    requiresAuth: to.meta.requiresAuth,
    isAuthenticated,
    userRole,
    storeRole: authStore.role,
    tokenExpired: authStore.isTokenExpired(),
    currentTime: new Date().toLocaleString()
  });

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      // Jika tidak login, arahkan ke halaman login
      return next({ name: 'Login' });
    }

    // Cek jika rute memerlukan peran spesifik
    if (to.meta.role && to.meta.role !== userRole) {
      // Jika peran tidak cocok, arahkan ke halaman yang sesuai
      // Default to student for OAuth users with 'authenticated' role
      if (userRole === 'student' || userRole === 'authenticated') {
        return next({ name: 'StudentDashboard' });
      }
      // Jika ada peran lain, bisa ditambahkan di sini
      return next({ name: 'Login' }); // fallback
    }
  }

  // Redirect pengguna yang sudah login dari halaman publik
  if (isAuthenticated && (to.name === 'Login' || to.name === 'Home')) {
    // Default to student dashboard for OAuth users with 'authenticated' role
    if (userRole === 'student' || userRole === 'authenticated') {
      return next({ name: 'StudentDashboard' });
    }
    if (userRole === 'lecturer') {
      return next({ name: 'LecturerDashboard' });
    }
    // Fallback to student dashboard for any other authenticated users
    return next({ name: 'StudentDashboard' });
  }

  next(); // Izinkan navigasi
});

export default router;
