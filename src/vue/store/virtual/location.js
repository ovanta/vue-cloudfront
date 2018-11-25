export const location = {

    namespaced: true,

    /**
     * Example location matching the current nodes list,
     * will be replaced with random generated data.
     */
    state: {
        node: null
    },

    getters: {

        getHierarchy(state, getters, rootState) {

            if (!state.node) {
                return [];
            }

            // Resolve hierarchy
            const hierarchy = [state.node];
            const {nodes} = rootState;
            for (let hash, parent; hash = hierarchy[0].parent, parent = nodes.find(v => v.hash === hash);) {
                hierarchy.splice(0, 0, parent);
            }

            return hierarchy;
        }

    },

    mutations: {

        /**
         * Updates the current position, if the hash already exists and the user is at least
         * one element under the root itself and all elements after it gets removed whereby
         * the last element is the node above the hash. Otherwiese it will be put on the top of the current location.
         * @param state
         * @param node
         */
        update(state, node) {

            // Validate
            if (typeof node !== 'object') {
                throw `Cannot perform 'update' in location. 'node' isn't a Object.`;
            }

            state.node = node;
        }
    },

    actions: {

        /**
         * Goes one up in the hierarchy
         */
        goUp({state, rootState}) {

            // Find parent
            const curParentHash = state.node.parent;
            const parent = rootState.nodes.find(v => v.hash === curParentHash);
            if (parent) {
                state.node = parent;
            }
        }
    }
};
