export const nodes = {

    namespaced: true,

    /**
     * Node-list (tree)
     */
    state: [],

    getters: {

        /**
         * Returns a object with file and folder props which are each
         * an array of nodes which are currently visible to the user.
         */
        currentDisplayedNodes(state, getters, rootState, otherGetters) {

            /**
             * Return a function which expects as argument if the size
             * of each folder should be calculated.
             */
            return includeFolderSize => {
                const {selection, clipboard, editable, search} = rootState;
                const selectionNodes = selection;
                const clipboardNodes = clipboard.nodes;
                const editableNode = editable.node;

                /**
                 * The nodes which should be shown changed if
                 * the user performs a search of want to see all currently starred nodes.
                 */
                const stateNodes = (() => {
                    if (search.active) {
                        return search.nodes;
                    } else if (rootState.showStarredNodes) {
                        return state.filter(v => v.starred);
                    } else {
                        return state;
                    }
                })();

                const stateNodesAmount = stateNodes.length;
                const locHash = otherGetters['location/currentLocation'];
                const nodes = {file: [], folder: []}; // Seperate files and folders

                function calcFolderSize(hash) {
                    let size = 0;

                    // Find childrens of current location
                    for (let i = 0, n; n = stateNodes[i], i < stateNodesAmount; i++) {
                        if (n.parent === hash) {
                            const {type} = n;

                            // If folder, recursivly calculate it otherwise just append size
                            if (type === 'folder') {
                                size += calcFolderSize(n.hash);
                            } else if (type === 'file') {
                                size += n.size;
                            }
                        }
                    }

                    return size;
                }

                // Find folder and files which has the current locations as parent
                // and calculate size
                for (let i = 0, n; n = stateNodes[i], i < stateNodesAmount; i++) {

                    // Check if parent is the current location
                    if (rootState.showStarredNodes || search.active || n.parent === locHash) {
                        const {type} = n;

                        // Pre-checks
                        n.cutted = clipboard.type === 'move' && clipboardNodes.includes(n);
                        n.selected = selectionNodes.includes(n);
                        n.editable = n === editableNode;
                        nodes[type].push(n);

                        // Calculate recursivly the size of each folder
                        if (includeFolderSize && type === 'folder') {
                            n.size = calcFolderSize(n.hash);
                        }
                    }
                }

                return nodes;
            };
        }
    },

    mutations: {

        /**
         * Replaces the current node-list
         * @param state
         * @param newNodes
         */
        update(state, newNodes) {

            // Validate
            if (!Array.isArray(newNodes)) {
                throw `Cannot perform 'update' in nodes. 'newNodes' isn't a Array.`;
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
                throw `Cannot perform 'delete' in nodes. 'nodes' isn't a Array.`;
            }

            function rm(node) {

                // If folder, delete all siblings first
                if (node.type === 'folder') {
                    for (let i = 0, n; n = state[i], i < state.length; i++) {
                        if (n.parent === node.hash) {
                            rm(n);
                            i = 0;
                        }
                    }
                }

                // Remove node
                state.splice(state.indexOf(node), 1);
            }

            // Delete folder / files recursivly
            for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {
                rm(n);
            }
        },

        addStar(state, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'addStar' in nodes. 'nodes' isn't a Array.`;
            }

            for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                n.starred = true;
            }
        },

        removeStar(state, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'removeStar' in nodes. 'nodes' isn't a Array.`;
            }

            for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                n.starred = false;
            }
        },

        /**
         * Renames one node
         * @param state
         * @param node
         * @param newName
         */
        rename(state, {node, newName}) {

            // Validate
            if (!node || !~state.indexOf(node)) {
                throw `Cannot perform 'rename' in nodes. 'node' is invalid or not present in current state.`;
            }

            if (!(typeof newName === 'string') || newName.length === 0) {
                throw `Cannot perform 'rename' in nodes. 'newName' should be a String and not empty.`;
            }

            // Update last-modified
            node.lastModified = Date.now();

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

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'move' in nodes. 'nodes' isn't a Array.`;
            }

            if (typeof destination !== 'string') {
                throw `Cannot perform 'move' in nodes. 'destination' isn't a String.`;
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
                throw `Cannot perform 'move' in nodes. Cannot put a folder into itself`;
            }

            // Move nodes
            nodes.forEach(n => n.parent = destination);
        },

        copy(state, {nodes, destination}) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'copy' in nodes. nodes isn't an Array.`;
            }

            if (typeof destination !== 'string') {
                throw `Cannot perform 'copy' in nodes. destination isn't a String.`;
            }

            const genHash = () => Math.round(Math.random() * 1e13).toString(16);

            function getSiblings(node) {
                const siblings = [];

                /**
                 * Every node needs a new hash (and so the childs a new parent), otherwise
                 * each element would be copied in place.
                 */
                const newHash = genHash();

                for (let i = 0, n; n = state[i], i < state.length; i++) {
                    if (n.parent === node.hash) {

                        // Copy sibling via spread syntax
                        siblings.push({...n});

                        if (n.type === 'folder') {
                            siblings.push(...getSiblings(n));
                        }

                        // Apply new hash from parent element
                        n.parent = newHash;
                    }
                }

                node.hash = newHash;
                return siblings;
            }

            // Clone nodes
            const cloned = nodes.map(v => ({...v}));

            // Set new parent and clone siblings and push to nodes
            for (let i = 0, n, l = cloned.length; n = cloned[i], i < l; i++) {
                n.parent = destination;
                cloned.push(...getSiblings(n));
            }

            state.push(...cloned);
        },

        changeColor(state, {nodes, color}) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'changeColor' in nodes. nodes isn't an Array.`;
            }

            if (typeof color !== 'string') {
                throw `Cannot perform 'changeColor' in nodes. color isn't a String.`;
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
         * @param parentHash
         */
        createFolder({commit, state}, parentHash) {

            // Validate
            if (typeof parentHash !== 'string' || !~state.find(v => v.hash === parentHash)) {
                throw `Cannot perform 'createFolder' in nodes. parent invalid or not present in state.`;
            }

            // TODO: Do centralized generating / creating of folders
            // Create folder
            const newFolder = {

                // TODO: create colission resistend function / backend to generate the hash
                hash: Math.round(Math.random() * 1e13).toString(16),
                parent: parentHash,
                type: 'folder',
                name: 'New Folder',
                lastModified: Date.now(),
                color: '#7E58C2',
                starred: false,
                editable: true
            };

            state.push(newFolder);
            return newFolder;
        }

    }
};
