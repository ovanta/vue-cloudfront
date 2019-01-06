import Vue  from 'vue';
import {on} from '../../js/utils';

/**
 * Context menu for both touch and desktop
 */
Vue.directive('contextMenu', {
    inserted(el, {value}) {

        // Validate
        if (!(typeof value === 'function')) {
            return;
        }

        let interval = null;
        on(el, 'contextmenu', value);
        on(el, 'touchstart', e => interval = setInterval(() => value(e), 500));
        on(el, ['touchend', 'touchcancel', 'touchmove'], () => interval && clearInterval(interval));
    }
});
