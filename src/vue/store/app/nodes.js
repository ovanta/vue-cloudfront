export const nodes = {

    namespaced: true,

    /**
     * Node-list (tree structure)
     */
    state: [],

    getters: {

        /**
         * Returns a object with file and folder props which are each
         * an array of nodes which are currently visible to the user.
         * This varies if the user is currently performing a search or is currently
         * viewing the marked nodes.
         */
        currentDisplayedNodes(state, getters, rootState) {

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
                const locHash = location.node && location.node.id;
                const ret = {file: [], dir: []}; // Seperate files and folders

                function calcFolderSize(hash) {
                    let size = 0;

                    // Find childrens of current location
                    for (let i = 0, n; n = nodes[i], i < stateNodesAmount; i++) {
                        if (n.parent === hash) {
                            const {type} = n;

                            // If folder, recursivly calculate it otherwise just append size
                            if (type === 'dir') {
                                size += calcFolderSize(n.id);
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

                        // Pre calculations
                        n.cutted = clipboard.type === 'move' && clipboardNodes.includes(n);
                        n.selected = selectionNodes.includes(n);
                        n.editable = n === editableNode;
                        ret[type].push(n);

                        // Calculate recursivly the size of each folder
                        if (includeFolderSize && type === 'dir') {
                            n.size = calcFolderSize(n.id);
                        }

                        // Extract extension and raw name
                        if (type === 'file') {
                            const extensionCut = n.name.lastIndexOf('.');
                            n.extension = ~extensionCut ? n.name.substring(extensionCut + 1) : '?';
                        }
                    }
                }

                return ret;
            };
        }
    },

    actions: {

        /**
         * Updates / fetches nodes.
         * @param state
         * @param rootState
         */
        async update({state, rootState}) {

            // Fetch from server
            return this.dispatch('fetch', {
                route: 'update',
                body: {
                    apikey: rootState.auth.apikey
                }
            }).then(({data: {nodes}, error}) => {

                if (error) {
                    throw error;
                }

                // Find root
                const root = nodes.find(v => v.parent === 'root');

                if (!root) {
                    throw 'Cannot examine root node.';
                }

                this.commit('location/update', root);
                state.splice(0, state.length, ...nodes);
            });
        },

        /**
         * Creates a new folder within the parent.
         * @param state
         * @param destination Parent node
         */
        async createFolder({state, rootState}, destination) {

            // Fetch from server
            return this.dispatch('fetch', {
                route: 'createFolder',
                body: {
                    apikey: rootState.auth.apikey,
                    parent: destination.id
                }
            }).then(({data: {node}, error}) => {

                if (error) {
                    throw error;
                }

                state.push(node);
                return node;
            });
        },

        /**
         * Move nodes to another folder.
         * @param state
         * @param rootState
         * @param nodes Nodes which should be moved
         * @param destination Destination node
         */
        async move({state, rootState}, {nodes, destination}) {

            // Prevent copy / move actions if search is active or user isn't at home or terminal
            if (rootState.search.active || (rootState.activeTab !== 'home' && rootState.activeTab !== 'terminal')) {
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
                const hash = node.id;
                const subfolder = [node];

                for (let i = 0, n; n = state[i], i < state.length; i++) {
                    if (n.parent === hash && n.type === 'dir') {
                        subfolder.push(...getSubFolders(n));
                    }
                }

                return subfolder;
            }

            // Check if user tries to put something into itself
            for (let i = 0; i < nodes.length; i++) {
                const subfolder = getSubFolders(nodes[i]);
                if (subfolder.includes(destination)) {
                    throw `Cannot perform 'move' in nodes. Cannot put a folder into itself`;
                }
            }

            // Move nodes
            nodes.forEach(n => n.parent = destination.id);
        },

        /**
         * Copy a node tree into another folder
         * @param state
         * @param rootState
         * @param nodes Nodes which should be copied
         * @param destination Destination node
         */
        async copy({state, rootState}, {nodes, destination}) {

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

            /**
             * Clones a node-tree
             * @param node Entry node
             * @returns {Array} Cloned nodes
             */
            function cloneSiblings(node) {
                const siblings = [];

                /**
                 * Every node needs a new hash (and so the childs a new parent), otherwise
                 * each element would be copied in place.
                 */
                const newHash = genHash();

                for (let i = 0, n; n = state[i], i < state.length; i++) {
                    if (n.parent === node.id) {

                        // Copy sibling via spread syntax
                        siblings.push({...n});

                        if (n.type === 'dir') {
                            siblings.push(...cloneSiblings(n));
                        }

                        // Apply new hash from parent element
                        n.parent = newHash;
                    }
                }

                node.id = newHash;
                return siblings;
            }

            // Function to extract a name and extension from a filename
            const parseName = name => {
                const rdi = name.indexOf('.');
                const di = ~rdi ? rdi : name.length;
                return {name: name.substring(0, di), extension: name.substring(di, name.length)};
            };

            const spelledNumber = num => {
                switch (num) {
                    case 1:
                        return `${num}st`;
                    case 2:
                        return `${num}nd`;
                    case 3:
                        return `${num}rd`;
                    default:
                        return `${num}th`;
                }
            };

            // Clone nodes and add copy prefix
            const cloned = nodes.map(v => {

                // Extract name and extenstion
                const vParsed = parseName(v.name);
                const vName = vParsed.name;
                const vExtension = vParsed.extension;

                // Find previous copied versions
                let version = 1, match;
                for (let i = 0, n, l = state.length; n = state[i], i < l; i++) {

                    // Extract raw name without any extensions
                    const nParsed = parseName(n.name);
                    const nName = nParsed.name;

                    /**
                     * First, check if node is child of the current location, if yes
                     * and it starts with the current to-copy nodes name and
                     * has already a copy flag increase it.
                     */
                    if (n.parent === destination.id &&
                        n.name.startsWith(vName) &&
                        (match = nName.match(/\((([\d]+)(st|nd|rd|th) |)Copy\)$/))) {

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
                    name: `${vName} ${version ? ` (${spelledNumber(version)} ` : '('}Copy)${vExtension}`
                };
            });

            // Set new parent and clone siblings and push to nodes
            const searchActive = rootState.search.active;
            for (let i = 0, n, l = cloned.length; n = cloned[i], i < l; i++) {

                // Don't re-define parents if search is performed
                if (!searchActive) {
                    n.parent = destination.id;
                }

                cloned.push(...cloneSiblings(n));
            }

            // Append cloned nodes
            state.push(...cloned);
        },

        /**
         * Deletes nodes recursivly
         * @param state
         * @param nodes Nodes which should be deleted
         */
        async delete({state}, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'delete' in nodes. 'nodes' isn't a Array.`;
            }

            function rm(node) {

                // If folder, delete all siblings first
                if (node.type === 'dir') {
                    for (let i = 0, n; n = state[i], i < state.length; i++) {
                        if (n.parent === node.id) {
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

        /**
         * Marks nodes. Can be viewed in the marked menu-section.
         * @param nodes Nodes which get a mark.
         */
        async addMark(_, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'mark' in nodes. 'nodes' isn't a Array.`;
            }

            for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                n.marked = true;
            }
        },

        /**
         * Removes a mark from nodes.
         * @param state
         * @param nodes Nodes from which the mark gets removed.
         */
        async removeMark(_, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform 'removeMark' in nodes. 'nodes' isn't a Array.`;
            }

            for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                n.marked = false;
            }
        },

        /**
         * Renames a node.
         * @param state
         * @param node The node which should be renamed
         * @param newName A new name.
         */
        async rename({state}, {node, newName}) {

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
         * Changes the color of folders.
         * @param state
         * @param nodes Nodes from which the color should be changed.
         * @param color A (basically) hex value like #fff (for white).
         */
        async changeColor(_, {nodes, color}) {

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
