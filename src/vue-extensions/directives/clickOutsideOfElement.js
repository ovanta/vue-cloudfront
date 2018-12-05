import Vue             from 'vue';
import {eventPath, on} from '../../js/utils';

// Directive to detect if user has clicked outside of a element
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
