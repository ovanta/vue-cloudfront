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
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'insert' in clipboard. 'nodes' isn't an Array.`;
            }

            if (!(type === 'copy' || type === 'cut')) {
                throw `Cannot perform 'insert' in index. 'type' is '${type}' but only 'move' and 'cut' are possible`;
            }

            state.type = type;
            state.nodes.push(...nodes);
        }
    }
};
