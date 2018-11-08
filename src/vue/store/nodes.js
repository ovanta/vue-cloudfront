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
                const {selection, clipboard, editable, search, location} = rootState;
                const selectionNodes = selection;
                const clipboardNodes = clipboard.nodes;
                const editableNode = editable.node;

                /**
                 * The nodes which should be shown changed if
                 * the user performs a search of want to see all currently starred nodes.
                 */
                const nodes = (() => {
                    if (search.active) {
                        return search.nodes;
                    } else if (rootState.activeTab === 'marked') {
                        return state.filter(v => v.marked);
                    } else {
                        return state;
                    }
                })();

                const stateNodesAmount = nodes.length;
                const locHash = location.node && location.node.hash;
                const ret = {file: [], folder: []}; // Seperate files and folders

                function calcFolderSize(hash) {
                    let size = 0;

                    // Find childrens of current location
                    for (let i = 0, n; n = nodes[i], i < stateNodesAmount; i++) {
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
                const autoAdd = rootState.activeTab === 'marked' || search.active;
                for (let i = 0, n; n = nodes[i], i < stateNodesAmount; i++) {

                    // Check if parent is the current location
                    if (autoAdd || n.parent === locHash) {
                        const {type} = n;

                        // Pre-checks
                        n.cutted = clipboard.type === 'move' && clipboardNodes.includes(n);
                        n.selected = selectionNodes.includes(n);
                        n.editable = n === editableNode;
                        ret[type].push(n);

                        // Calculate recursivly the size of each folder
                        if (includeFolderSize && type === 'folder') {
                            n.size = calcFolderSize(n.hash);
                        }
                    }
                }

                return ret;
            };
        }
    },

    actions: {

        /**
         * Creates a new folder within the parent.
         * @param commit
         * @param state
         * @param destination
         */
        createFolder({commit, state}, destination) {

            // Validate
            if (typeof destination !== 'object' || !~state.find(v => v === destination)) {
                throw `Cannot perform 'createFolder' in nodes. parent invalid or not present in state.`;
            }

            // TODO: Do centralized generating / creating of folders
            // Create folder
            const newFolder = {

                // TODO: create colission resistend function / backend to generate the hash
                hash: Math.round(Math.random() * 1e13).toString(16),
                parent: destination.hash,
                type: 'folder',
                name: 'New Folder',
                lastModified: Date.now(),
                color: '#7E58C2',
                marked: false,
                editable: true
            };

            state.push(newFolder);
            return newFolder;
        },

        /**
         * Move nodes to another folder
         * @param state
         * @param rootState
         * @param nodes
         * @param destination
         */
        move({state, rootState}, {nodes, destination}) {

            // Prevent copy / move actions if search is active or user isn't at home
            if (rootState.search.active || rootState.activeTab !== 'home') {
                return;
            }

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'move' in nodes. 'nodes' isn't a Array.`;
            }

            if (typeof destination !== 'object') {
                throw `Cannot perform 'move' in nodes. 'destination' isn't a Object.`;
            }

            // Check if user paste folder into itself or one of its siblings
            function getSubFolders(node) {
                const hash = node.hash;
                const subfolder = [node];

                for (let i = 0, n; n = state[i], i < state.length; i++) {
                    if (n.parent === hash && n.type === 'folder') {
                        subfolder.push(...getSubFolders(n));
                    }
                }

                return subfolder;
            }

            const subfolder = getSubFolders(nodes[0]);
            if (subfolder.includes(destination)) {
                throw `Cannot perform 'move' in nodes. Cannot put a folder into itself`;
            }

            // Move nodes
            nodes.forEach(n => n.parent = destination.hash);
        },

        copy({state, rootState}, {nodes, destination}) {

            // If user is currently not at home, ignore action
            if (rootState.activeTab !== 'home') {
                return;
            }

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'copy' in nodes. nodes isn't an Array.`;
            }

            if (typeof destination !== 'object') {
                throw `Cannot perform 'copy' in nodes. destination isn't a Object.`;
            }

            // TODO: Centralized hash-gen?!
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

            // Clone nodes and add copy prefix
            const cloned = nodes.map(v => {

                // Find previous copied versions
                let version = 1, match;
                for (let i = 0, n, l = state.length; n = state[i], i < l; i++) {

                    /**
                     * First, check if node is child of the current location, if yes
                     * and it starts with the current to-copy nodes name and
                     * has already a copy flag increase it.
                     */
                    if (n.parent === v.parent &&
                        n.name.startsWith(v.name) &&
                        (match = n.name.match(/\((([\d]+)th |)Copy\)$/))) {

                        // Check if node has been already multiple times copied
                        if (match[2]) {
                            const val = Number(match[2]);

                            // Check if version is above current
                            if (val && val >= version) {
                                version = val + 1;
                            }
                        }
                    }
                }

                return {
                    ...v,

                    // First copy gets only a '(Copy)' hint
                    name: `${v.name} ${version ? ` (${version}th ` : '('}Copy)`
                };
            });

            // Set new parent and clone siblings and push to nodes
            const searchActive = rootState.search.active;
            for (let i = 0, n, l = cloned.length; n = cloned[i], i < l; i++) {

                // Don't re-define parents if search is performed
                if (!searchActive) {
                    n.parent = destination.hash;
                }

                cloned.push(...getSiblings(n));
            }

            state.push(...cloned);
        },


        /**
         * Replaces the current node-list
         * @param state
         * @param newNodes
         */
        update({state}, newNodes) {

            // Validate
            if (!Array.isArray(newNodes)) {
                throw `Cannot perform 'update' in nodes. 'newNodes' isn't a Array.`;
            }

            state.splice(0, state.length, ...newNodes);
        },

        /**
         * Deletes nodes recursivly
         * @param state
         * @param nodes
         */
        delete({state}, nodes) {

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

        addMark({state}, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'mark' in nodes. 'nodes' isn't a Array.`;
            }

            for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                n.marked = true;
            }
        },

        removeMark({state}, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'removeMark' in nodes. 'nodes' isn't a Array.`;
            }

            for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                n.marked = false;
            }
        },

        /**
         * Renames one node
         * @param state
         * @param node
         * @param newName
         */
        rename({state}, {node, newName}) {

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

        changeColor({state}, {nodes, color}) {

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
    }
};
