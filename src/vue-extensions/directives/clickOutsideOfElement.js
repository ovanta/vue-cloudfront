import Vue             from 'vue';
import {eventPath, on} from '../../js/utils';

/**
 * Fires a function (wich should be passed as value) if
 * the user clicks outside of the binded element.
 */
Vue.directive('clickOutsideOfElement', {
    inserted(el, {value}) {

        // Validate
        if (!(typeof value === 'function')) {
            return;
        }

        // Detect whenever user clicks outside of a element
        on(window, 'click', e => {
            !eventPath(e).includes(el) && value();
        });
    }
});
