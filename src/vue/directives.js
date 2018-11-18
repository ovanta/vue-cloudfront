import Vue from 'vue';
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
