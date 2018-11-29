import Vue   from 'vue';
import App   from './vue/App.vue';
import store from './vue/store/index';

// Custom plugins
import CallOnDestroy from './vue-extensions/plugins/CallOnDestroy';

Vue.use(CallOnDestroy);

// Import service worker
import './registerServiceWorker';

// Add utils to vue
import * as _ from './js/utils';

Vue.prototype.utils = _;

// Entry point
new Vue({
    render: h => h(App),
    store
}).$mount('#app');
