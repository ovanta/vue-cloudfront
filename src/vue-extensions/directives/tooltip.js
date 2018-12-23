import Vue       from 'vue';
import {off, on} from '../../js/utils';

/**
 * Basic tooltip directive, expect a string which
 * is used as tooltip content.
 */
Vue.directive('tooltip', (() => {
    const state = new WeakMap();

    const update = (el, {value}, vnode) => {
        const {commit} = vnode.context.$store;

        // Check if store already contains listeners
        if (state.has(el)) {
            state.get(el).forEach(args => off(...args));
        }

        /**
         * Create event listeners for move-in and move-out to
         * show / hide a tooltip.
         */
        const data = [
            on(el, 'mouseenter', () => commit('tooltip/show', {el, text: value})),
            on(el, 'mouseleave', () => commit('tooltip/hide'))
        ];

        // Store listeners in WeakMap to unbind these on update
        state.set(el, data);
    };

    return {
        inserted: update,
        componentUpdated: update
    };
})());
