import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { store } from './_store';
import { router } from './_helpers';
import App from './app/App';
import VueApexCharts from 'vue-apexcharts';
Vue.use(VeeValidate);
Vue.use(VueApexCharts);
// import axios from 'axios';
window.axios = require('axios');
// Vue.use(axios);
// setup fake backend
import { configureFakeBackend } from './_helpers';
configureFakeBackend();
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});