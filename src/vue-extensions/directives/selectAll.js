import Vue from 'vue';

/**
 * Directive will, if evaluated value is truish, select
 * the entire text-content of an specific node.
 */
Vue.directive('select-all', {
    update(el, bind) {
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
});
