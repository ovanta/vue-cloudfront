import Vue  from 'vue';

/**
 * Makes a element content-editable. Fixes scroll bug if value
 * get false and theres a scroll offset.
 */
Vue.directive('contentEditable', {
    inserted(el, {value}) {
        el.scrollLeft = 0;
        el.setAttribute('contenteditable', !!value);
    },

    update(el, {value}) {
        el.scrollLeft = 0;
        el.setAttribute('contenteditable', !!value);
    }
});
