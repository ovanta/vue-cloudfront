import Vue    from 'vue';
import * as _ from '../js/utils';

// Will focus an input element if v-focus is true.
Vue.directive('selectAll', {
    inserted: selectAll,
    update: selectAll
});

function selectAll(el, bind) {
    if (bind.value) {
        if (window.getSelection && document.createRange) {
            const range = document.createRange();
            range.selectNodeContents(el);

            const sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
        } else if (document.body.createTextRange) {
            const range = document.body.createTextRange();
            range.moveToElementText(el);
            range.select();
        }
    }
}

// Blur a input if the user clicks somewhere else
Vue.directive('strict-focus', {
    inserted(el) {
        _.on(window, 'mousedown', e => {
            e.target !== el && el.blur();
        });
    }
});

// Tooltip directive
Vue.directive('tooltip', (() => {
    const state = new WeakMap();

    const update = (el, {value}, vnode) => {
        const {commit} = vnode.context.$store;

        // Check if store already contains listeners
        if (state.has(el)) {
            state.get(el).forEach(args => _.off(...args));
        }

        /**
         * Create event listeners for move-in and move-out to
         * show / hide a tooltip.
         */
        const data = [
            _.on(el, 'mouseenter', () => commit('tooltip/show', {el, text: value})),
            _.on(el, 'mouseleave', () => commit('tooltip/hide'))
        ];

        // Store listeners in WeakMap to unbind these on update
        state.set(el, data);
    };

    return {
        inserted: update,
        componentUpdated: update
    };
})());

// Directive to detect if user has clicked outside of a element
Vue.directive('clickOutsideOfElement', {
    inserted(el, {value}) {

        // Validate
        if (!(typeof value === 'function')) {
            return;
        }

        // Detect whenever user clicks outside of a element
        _.on(window, 'click', e => {
            !_.eventPath(e).includes(el) && value();
        });
    }
});
