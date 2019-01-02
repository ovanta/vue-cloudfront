import Vue  from 'vue';
import {on} from '../../js/utils';

/**
 * Double click, just also for touch devices
 */
Vue.directive('doubleClick', {
    inserted(el, {value}) {

        // Validate
        if (!(typeof value === 'function')) {
            return;
        }

        let lastTap = 0;
        on(el, ['touchend', 'mouseup'], () => {
            if (Date.now() - lastTap < 500) {
                value();
            }

            lastTap = Date.now();
        });
    }
});
