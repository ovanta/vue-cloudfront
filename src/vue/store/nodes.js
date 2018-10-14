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
        },

        /**
         * Deletes nodes recursivly
         * @param state
         * @param nodes
         */
        delete(state, nodes) {
            nodes.forEach(function rm(node) {

                // If folder, delete all siblings first
                if (node.type === 'folder') {
                    state.filter(v => v.parent === node.hash).forEach(rm);
                }

                // Remove node
                state.splice(state.indexOf(node), 1);
            });
        },

        /**
         * Renames one node
         * @param state
         * @param node
         */
        rename(state, {node, newName}) {

            // Validate node
            if (!node || !~state.indexOf(node)) {
                throw 'Node not present in state or invalid: ' + JSON.stringify(node);
            }

            // Validate new name
            if (!newName || newName.length === 0) {
                throw 'Node name cannot be empty.';
            }

            // Perform rename
            node.name = newName;
        }
    }
};
