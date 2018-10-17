export const editable = {

    namespaced: true,

    state: {
        node: null
    },

    mutations: {

        /**
         * Sets an node which can be edited
         * @param state
         * @param node
         */
        set(state, node) {

            // Validate
            if (typeof node !== 'object') {
                throw 'Cannot perform SET in editable. node is not a object';
            }

            state.node = node;
        },

        reset(state) {
            state.node = null;
        }

    }

};
