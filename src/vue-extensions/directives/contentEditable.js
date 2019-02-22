import Vue from 'vue';

/**
 * Makes a element content-editable. Fixes scroll bug if value
 * get false and theres a scroll offset.
 */
Vue.directive('contentEditable', {
    update(el, {value, oldValue}) {
        if (value !== oldValue) {
            el.scrollLeft = 0;
            el.setAttribute('contenteditable', String(!!value));
        }
    }
});
