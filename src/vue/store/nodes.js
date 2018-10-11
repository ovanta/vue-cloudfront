export const nodes = {

    namespaced: true,

    /**
     * Node-list (tree)
     */
    state: [],

    mutations: {

        /**
         * Replaces the current node-list
         * @param state
         * @param newNodes
         */
        update(state, newNodes) {
            if (newNodes && newNodes.length) {
                state.splice(0, state.length, ...newNodes);
            }
        }

    }
};
