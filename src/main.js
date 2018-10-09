import Vue from 'vue';
import App from './vue/App.vue';
import store from './vue/store/index';

new Vue({
    render: h => h(App),
    store
}).$mount('#app');
