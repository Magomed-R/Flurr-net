import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3000';
axios.defaults.headers.common['Content-type'] = 'application/json'

import dayjs from 'dayjs'
import 'dayjs/locale/ru';
dayjs.locale('ru');

createApp(App).use(router).mount('#app')
