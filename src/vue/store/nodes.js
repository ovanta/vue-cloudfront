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

            // Validate
            if (!Array.isArray(newNodes)) {
                throw 'Cannot perform UPDATE in nodes. newNodes is not a Array.';
            }

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

            // Validate
            if (!Array.isArray(nodes)) {
                throw 'Cannot perform DELETE in nodes. Nodes is not a Array.';
            }

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
                throw 'Cannot perform RENAME in nodes. Node invalid or not present in set.';
            }

            // Validate new name
            if (!newName || newName.length === 0) {
                throw 'Cannot perform RENAME in nodes. Node name cannot be empty, null or undefined.';
            }

            // Perform rename
            node.name = newName;
        },

        /**
         * Move nodes to another folder
         * @param state
         * @param nodes
         * @param destination
         */
        move(state, {nodes, destination}) {

            // Validate nodes
            if (!Array.isArray(nodes)) {
                throw `Cannot perform MOVE in nodes. nodes isn't an Array.`;
            }

            // Validate destination
            if (typeof destination !== 'string') {
                throw `Cannot perform MOVE in nodes. destination isn't a String.`;
            }

            // Check if user paste folder into itself or one of its siblings
            function getSubFolders(hash) {
                const subfolder = [hash];

                for (let i = 0, n; n = state[i], i < state.length; i++) {
                    if (n.parent === hash && n.type === 'folder') {
                        subfolder.push(...getSubFolders(n.hash));
                    }
                }

                return subfolder;
            }

            const subfolder = getSubFolders(nodes[0].hash);
            if (subfolder.includes(destination)) {
                throw 'Cannot perform MOVE in nodes. Tried to put a folder into itself or similar.';
            }

            // Move nodes
            nodes.forEach(n => n.parent = destination);
        },

        changeColor(state, {nodes, color}) {

            // Validate nodes
            if (!Array.isArray(nodes)) {
                throw `Cannot perform CHANGECOLOR in nodes. nodes isn't an Array.`;
            }

            if (typeof color !== 'string') {
                throw `Cannot perform CHANGECOLOR in nodes. color isn't an String.`;
            }

            // Override color
            nodes.forEach(n => n.color = color);
        }
    },

    actions: {

        /**
         * Creates a new folder within the parent.
         * @param commit
         * @param state
         * @param parent
         */
        createFolder({commit, state}, parent) {

            // Validate destination
            if (!parent || !~state.indexOf(parent)) {
                throw 'Cannot perform NEWFOLDER in nodes. Parent invalid or not present in set.';
            }

            // TODO: Do centralized generating / createing of folders
            // Create folder
            const newFolder = {

                // TODO: create colission resistend function / backend to generate the hash
                hash: Math.round(Math.random() * 1e13).toString(16),
                parent: parent.hash,
                type: 'folder',
                name: 'New Folder',
                lastModified: Date.now(),
                color: '#7E58C2',
                editable: true
            };

            state.push(newFolder);
            return newFolder;
        }

    }
};
