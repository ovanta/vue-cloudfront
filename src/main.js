import Vue   from 'vue';
import App   from './vue/App.vue';
import store from './vue/store/index';

// Import service worker
import './registerServiceWorker';

// Vue utils
import * as _ from './js/utils';

// Import global stuff
import './vue-extensions/plugins';
import './vue-extensions/filters';
import './vue-extensions/directives';

Vue.prototype.utils = _;

// Entry point
new Vue({
    render: h => h(App),
    store
}).$mount('#app');
