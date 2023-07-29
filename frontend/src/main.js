import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";

import axios from "axios";
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3010'
axios.defaults.headers.common["Content-type"] = "application/json";
axios.defaults.headers.common["authorization"] = localStorage.token;

console.log(axios.defaults.baseURL)

import dayjs from "dayjs";
import "dayjs/locale/ru";
dayjs.locale("ru");

createApp(App).use(router).mount("#app");
