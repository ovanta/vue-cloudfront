export const clipboard = {

    namespaced: true,

    state: {
        nodes: [],
        type: null
    },

    mutations: {

        /**
         * Clears the clipboard
         * @param state
         */
        clear(state) {
            state.nodes = [];
            state.type = null;
        },

        /**
         * Copies something into the clipbord, overrides existing values.
         * @param state
         * @param nodes
         * @param type
         */
        insert(state, {nodes, type}) {

            // Validate
            if (!Array.isArray(nodes) || !(type === 'copy' || type === 'cut')) {
                throw `Cannot perform INSERT in clipboard. nodes isn't an Array or type is invalid. Got type ${type}`;
            }

            state.type = type;
            state.nodes.push(...nodes);
        }
    }
};
