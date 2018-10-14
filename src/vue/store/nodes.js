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
         * @param newName
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
        },

        /**
         * Creates a new folder within the parent.
         * @param state
         * @param parent
         */
        newFolder(state, parent) {

            // Validate destination
            if (!parent || !~state.indexOf(parent)) {
                throw 'Parent not present in state or invalid: ' + JSON.stringify(parent);
            }

            // TODO: Do centralized generating / createing of folders
            // Create folder
            state.push({

                // TODO: create colission resistend function / backend to generate the hash
                hash: Math.round(Math.random() * 1e13).toString(16),
                parent: parent.hash,
                type: 'folder',
                name: 'New Folder',
                lastModified: Date.now(),
                color: '#7E58C2',
                editable: true
            });
        }
    }
};
