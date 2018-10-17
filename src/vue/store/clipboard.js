export const clipboard = {

    namespaced: true,

    state: {
        nodes: [],
        type: null //
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
            if (!nodes || !nodes.length || !(type === 'copy' || type === 'cut')) {
                throw `No nodes, nodes array empty or invalid type. Clipboard copy (${type}) aborted`;
            }

            state.type = type;
            state.nodes.push(...nodes);
        }
    }
};
