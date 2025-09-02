
import { createRouter, createWebHistory } from 'vue-router';
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
    path: '/Dashboardstudent',
    name: 'Dashboardstudent',
    component: Dashboardstudent,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;