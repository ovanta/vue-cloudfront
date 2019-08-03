import Vue  from 'vue';
import {on} from '../../js/utils';

/**
 * Double click, just also for touch devices
 */
Vue.directive('doubleTap', (() => {
    const map = new WeakMap();

    return {
        inserted(el, binding) {
            map.set(el, binding.value);

            let lastTap = 0;
            on(el, 'click', ev => {
                const {button} = ev;
                const value = map.get(el);

                if ((typeof button === 'number' && button) || typeof value !== 'function') {
                    return;
                }

                if (Date.now() - lastTap < 500) {
                    value(ev);
                }

                lastTap = Date.now();
            });
        },

        update(el, {value, oldValue}) {
            if (value !== oldValue) {

                // Update expression
                map.set(el, value);
            }
        }
    };
})());
