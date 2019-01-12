import Vue  from 'vue';
import {on} from '../../js/utils';

/**
 * Forces a element to get blurred if user clicks on something
 * which is not the element itself.
 */
Vue.directive('strictFocus', {
    inserted(el) {
        on(window, 'click', e => {
            e.target !== el && el.blur();
        });
    }
});
