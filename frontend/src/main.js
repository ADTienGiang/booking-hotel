import { createApp } from 'vue';
import App from './App.vue';
import axiosPlugin from './plugins/axios.js';
import router from './router/index.js';
import * as store from './store/search'; // Import toàn bộ module Vuex

import 'dotenv';

createApp(App)
  .use(axiosPlugin)
  .use(router)
  .mount('#app');
import 'bootstrap/dist/js/bootstrap.js';
