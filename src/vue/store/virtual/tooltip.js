export const tooltip = {

    namespaced: true,

    state: {
        el: null,
        visible: false,
        text: null
    },

    mutations: {

        /**
         * Shows a tooltip relative to a specific element
         * @param state
         * @param el Reference elemnt
         * @param text Display text
         */
        show(state, {el, text}) {

            // Validate
            if (!(el instanceof Element)) {
                throw `Cannot perform 'show' in tooltip. el is not a child of Element.`;
            }

            // Apply element, header and body
            state.el = el;
            state.text = text;
            state.visible = true;
        },

        hide(state) {
            state.visible = false;
        }

    }

};
