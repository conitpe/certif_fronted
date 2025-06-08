import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "./assets/css/nucleo-icons.css";
import "./assets/css/nucleo-svg.css";
import "./assets/css/main.css";
import ArgonDashboard from "./argon-dashboard";
import 'vue-good-table/dist/vue-good-table.css';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";



const appInstance = createApp(App);
appInstance.use(store);
appInstance.use(router);
appInstance.component("v-select", Multiselect);
appInstance.use(VueSweetalert2, { confirmButtonColor: '#F5A85B', cancelButtonColor: '#a5a5a5' });
appInstance.use(ArgonDashboard);

appInstance.mount("#app");
