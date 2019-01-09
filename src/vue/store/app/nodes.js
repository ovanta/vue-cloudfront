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

    mutations: {

        // Adds nodes to the collection
        put(state, {nodes}) {
            if (Array.isArray(nodes)) {
                state.push(...nodes);
            }
        }
    },

    actions: {

        /**
         * Updates / fetches nodes.
         * @param state
         * @param rootState
         * @param keepLocation If function should try to restore the previous location
         */
        async update({state, rootState}, {keepLocation = false} = {}) {

            // Fetch from server
            return this.dispatch('fetch', {
                route: 'update',
                body: {
                    apikey: rootState.auth.apikey
                }
            }).then(({nodes}) => {

                // Find root and try to restore location
                const root = nodes.find(v => v.parent === 'root');

                if (!root) {
                    throw 'Cannot examine root node.';
                }

                // Set location
                if (keepLocation) {
                    const locationId = rootState.location.node && rootState.location.node.id;
                    const locNode = locationId && nodes.find(v => v.id === locationId);
                    this.commit('location/update', locNode ? locNode : root);
                } else {
                    this.commit('location/update', root);
                }

                state.splice(0, state.length, ...nodes);
            });
        },

        /**
         * Creates a new folder within the parent.
         * @param state
         * @param rootState
         * @param name Optional name
         * @param parent Parent node
         */
        async createFolder({state, rootState}, {name, parent}) {

            // Fetch from server
            return this.dispatch('fetch', {
                route: 'createFolder',
                body: {
                    apikey: rootState.auth.apikey,
                    parent: parent.id,
                    name
                }
            }).then(({node}) => {
                state.push(node);
                return node;
            });
        },

        /**
         * Creates a folder hierarchy based on a liked-list-like array
         * @param state
         * @param rootState
         * @param parent
         * @param folders
         */
        createFolders({state, rootState}, {folders, parent}) {

            // Fetch from server
            return this.dispatch('fetch', {
                route: 'createFolders',
                body: {
                    apikey: rootState.auth.apikey,
                    parent: parent.id,
                    folders
                }
            }).then(({nodes, idMap}) => {
                state.push(...nodes);
                return {nodes, idMap};
            });
        },

        /**
         * Move nodes to another folder.
         * @param rootState
         * @param nodes Nodes which should be moved
         * @param destination Destination node
         */
        async move({rootState}, {nodes, destination}) {

            // Prevent copy / move actions if search is active or user isn't at home
            if (rootState.search.active || rootState.activeTab !== 'home') {
                return;
            }

            return this.dispatch('fetch', {
                route: 'move',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id),
                    destination: destination.id
                }
            }).then(() => {

                // Update nodes locally to save ressources
                nodes.forEach(n => n.parent = destination.id);
            });
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

            return this.dispatch('fetch', {
                route: 'copy',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id),
                    destination: destination.id
                }
            }).then(({nodes}) => {

                // Add new nodes
                state.push(...nodes);
                return nodes;
            });
        },

        /**
         * Deletes nodes recursivly
         * @param state
         * @param rootState
         * @param nodes Nodes which should be deleted
         */
        async delete({state, rootState}, nodes) {
            return this.dispatch('fetch', {
                route: 'delete',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id)
                }
            }).then(() => {

                // Update nodes locally to save ressources
                const rm = node => {
                    if (node.type === 'dir') {
                        for (let i = 0; i < state.length; i++) {
                            if (state[i].parent === node.id) {
                                rm(state[i]);
                                i = 0;
                            }
                        }
                    }
                    const idx = state.indexOf(node);
                    state.splice(idx, 1);
                };

                nodes.forEach(rm);
            });
        },

        /**
         * Marks nodes. Can be viewed in the marked menu-section.
         * @param nodes Nodes which get a mark.
         */
        async addMark({rootState}, nodes) {
            return this.dispatch('fetch', {
                route: 'addMark',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id)
                }
            }).then(() => {

                // Update node locally to save ressources
                for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                    n.marked = true;
                }
            });
        },

        /**
         * Removes a mark from nodes.
         * @param nodes Nodes from which the mark gets removed.
         */
        async removeMark({rootState}, nodes) {
            return this.dispatch('fetch', {
                route: 'removeMark',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id)
                }
            }).then(() => {

                // Update node locally to save ressources
                for (let i = 0, n; n = nodes[i], i < nodes.length; i++) {
                    n.marked = false;
                }
            });
        },

        /**
         * Renames a node.
         * @param rootState
         * @param node The node which should be renamed
         * @param newName A new name.
         */
        async rename({rootState}, {node, newName}) {
            return this.dispatch('fetch', {
                route: 'rename',
                body: {
                    apikey: rootState.auth.apikey,
                    target: node.id,
                    newName
                }
            }).then(() => {

                // Update node locally to save ressources
                node.lastModified = Date.now();
                node.name = newName;
            });
        },

        /**
         * Changes the color of folders.
         * @param state
         * @param nodes Nodes from which the color should be changed.
         * @param color A (basically) hex value like #fff (for white).
         */
        async changeColor({rootState}, {nodes, color}) {
            return this.dispatch('fetch', {
                route: 'changeColor',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id),
                    newColor: color
                }
            }).then(() => {

                // Override color
                nodes.forEach(n => n.color = color);
            });
        },

        /**
         * Requests a static link for this specific node
         * @param rootState
         * @param node
         */
        async addStaticId({rootState}, {node}) {
            return this.dispatch('fetch', {
                route: 'addStaticId',
                body: {
                    apikey: rootState.auth.apikey,
                    node: node.id
                }
            }).then(id => {

                // Append link
                node.staticIds = node.staticIds || [];
                node.staticIds.push(id);
                return id;
            });
        },

        /**
         * Requests a static link for this specific node
         * @param rootState
         * @param node
         */
        async removeStaticId({rootState}, {node, ids}) {
            return this.dispatch('fetch', {
                route: 'removeStaticId',
                body: {
                    apikey: rootState.auth.apikey,
                    node: node.id,
                    ids
                }
            }).then(() => {

                // Append link
                node.staticIds = node.staticIds || [];
                node.staticIds = node.staticIds.filter(id => !ids.includes(id));
            });
        }
    }
};
