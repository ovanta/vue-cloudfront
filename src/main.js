import Vue from 'vue';
import App from './vue/App.vue';
import store from './vue/store/index';

// Custom plugins
import CallOnDestroy from './vue-extensions/plugins/CallOnDestroy';
Vue.use(CallOnDestroy);

// Entry point
new Vue({
    render: h => h(App),
    store
}).$mount('#app');
