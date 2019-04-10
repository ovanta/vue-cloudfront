import Vue   from 'vue';
import App   from './vue/App.vue';
import store from './vue/store/index';

// Import service worker
import './registerServiceWorker';

// Utils and config
import * as _ from './js/utils';
import config from '../config/config';

// Import global stuff
import './vue-extensions/plugins';
import './vue-extensions/filters';
import './vue-extensions/directives';

Vue.config.productionTip = false;

// Global props
Vue.prototype.$utils = _;
Vue.prototype.$config = config;

// Entry point
new Vue({
    render: h => h(App),
    store
}).$mount('#app');
