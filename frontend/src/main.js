import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { authStore } from './store/auth';

authStore.init().then(() => {
  createApp(App)
    .use(router)
    .mount('#app');
});
