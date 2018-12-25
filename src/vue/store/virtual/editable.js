export const editable = {

    namespaced: true,

    state: {
        node: null
    },

    mutations: {

        clear(state) {
            state.node = null;
        },

        /**
         * Sets an node which can be edited
         * @param state
         * @param node
         */
        set(state, node) {

            // Validate
            if (typeof node !== 'object') {
                throw `Cannot perform 'set' in editable. 'node' isn't a Object.`;
            }

            state.node = node;
        }

    }

};
