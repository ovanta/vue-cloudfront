import Vue from 'vue';
import App from './vue/App.vue';
import store from './vue/store/index';

// Global components
import IntroBox from './vue/ui/IntroBox';
Vue.component('intro-box', IntroBox);

new Vue({
    render: h => h(App),
    store
}).$mount('#app');
