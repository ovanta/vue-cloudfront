import Vue  from 'vue';
import {on} from '../../js/utils';

Vue.directive('strict-focus', {
    inserted(el) {
        on(window, 'mousedown', e => {
            e.target !== el && el.blur();
        });
    }
});
