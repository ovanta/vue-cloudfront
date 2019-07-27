import websocket from '../../../socket/socket';
import {pick}    from '../../../js/utils';

export const nodes = {

    namespaced: true,

    /**
     * Node-list (tree structure)
     */
    state: [],

    getters: {


        /**
         * Calcualtes the directory size including all sub-nodes
         * @param state
         * @returns {Function}
         */
        directorySize(state) {
            const map = new Map();
            const entry = state.find(n => n.parent === 'root');

            if (entry) {
                (function calcDirectorySize(id) {
                    let size = 0;

                    // Find childrens of current location
                    for (let i = 0, n, total = state.length; n = state[i], i < total; i++) {
                        if (n.parent === id) {

                            // If folder, recursivly calculate it otherwise just append size
                            if (n.type === 'dir') {
                                const nodeSize = calcDirectorySize(n.id);
                                map.set(id, nodeSize);
                                size += nodeSize;
                            } else if (n.type === 'file') {
                                size += n.size;
                            }
                        }
                    }

                    return size;
                })(entry.id);
            }

            return id => map.get(id);
        },

        /**
         * Returns a object with file and folder props which are each
         * an array of nodes which are currently visible to the user.
         * This varies if the user is currently performing a search or is currently
         * viewing the marked nodes.
         */
        currentDisplayedNodes(state, getters, rootState) {
            const {search, location, activeTab} = rootState;

            /**
             * The nodes which should be shown changed if
             * the user performs a search of want to see all currently starred nodes.
             */
            const nodes = (() => {
                if (search.active) {
                    return search.nodes;
                } else if (activeTab === 'marked') {
                    return state.filter(v => v.marked && !v.bin);
                } else if (activeTab === 'bin') {
                    return state.filter(v => v.bin);
                }

                return state.filter(v => !v.bin);
            })();

            const nodesAmount = nodes.length;
            const locHash = location.node && location.node.id;
            const ret = {file: [], dir: []}; // Seperate files and folders

            // Find folder and files which has the current locations as parent
            // and calculate size
            const autoAdd = activeTab === 'marked' || activeTab === 'bin' || search.active;
            for (let i = 0, n; n = nodes[i], i < nodesAmount; i++) {

                // Check if parent is the current location
                if (autoAdd || n.parent === locHash) {
                    const {type} = n;

                    // Extract extension and raw name
                    if (type === 'file') {
                        const extensionCut = n.name.lastIndexOf('.');
                        n.extension = ~extensionCut ? n.name.substring(extensionCut + 1) : '?';
                    }

                    ret[type].push(n);
                }
            }

            return ret;
        },

        /**
         * Calculates the current amount of space used
         * @param state
         * @returns {number}
         */
        totalSize(state) {
            let size = 0;

            for (let i = 0, l = state.length; i < l; i++) {
                size += state[i].size || 0;
            }

            return size;
        }
    },

    mutations: {

        // Adds nodes to the collection
        put(state, {nodes}) {
            if (Array.isArray(nodes)) {
                state.push(...nodes);
                websocket.broadcast('nodes', 'put', nodes);
            }
        },

        // Websocket sync
        socketSync(state, {action, payload}) {
            switch (action) {
                case 'put': {
                    return state.push(...payload);
                }
                case 'change': {

                    for (let i = 0, l = payload.length; i < l; i++) {
                        const changes = payload[i];
                        const node = state.find(v => v.id === changes.id);

                        if (node) {
                            Object.assign(node, changes);
                        }
                    }

                    return state.splice(0, state.length, ...state);
                }
                case 'delete': {

                    for (let i = 0, l = payload.length; i < l; i++) {
                        const index = state.findIndex(v => v.id === payload[i]);

                        if (~index) {
                            state.splice(index, 1);
                        }
                    }
                }
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

                /**
                 * To prevent nodes from poppin' up during search find all
                 * sub-nodes from every node which has been moved to the bin and mark
                 * these via _subBin. These nodes will be skipped while searching.
                 * @type {Array}
                 */
                const binDirs = [];
                for (let i = 0, count = nodes.length; i < count; i++) {
                    const n = nodes[i];

                    if (!n._subBin && (n.bin || binDirs.includes(n.parent))) {

                        if (n.type === 'dir') {
                            binDirs.push(n.id);
                        }

                        n._subBin = true;
                        i = 0;
                    }
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
                websocket.broadcast('nodes', 'put', [node]);
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
        createFolders({rootState}, {folders, parent}) {

            // Fetch from server
            return this.dispatch('fetch', {
                route: 'createFolders',
                silent: true,
                body: {
                    apikey: rootState.auth.apikey,
                    parent: parent.id,
                    folders
                }
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
            }).catch(err => {

                // Show error
                this.commit('dialogbox/show', {
                    type: 'error',
                    title: 'Action failed',
                    text: 'Cannot put a directory into itself.',
                    buttons: [
                        {type: 'accept', text: 'Okay'}
                    ]
                });

                throw err.text;
            }).then(() => {

                // Update nodes locally to save ressources
                nodes.forEach(n => n.parent = destination.id);
                websocket.broadcast('nodes', 'change', nodes.map(v => pick(v, 'id', 'parent')));
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
                websocket.broadcast('nodes', 'put', nodes);
                return nodes;
            });
        },

        /**
         * Deletes nodes recursivly
         * @param state
         * @param rootState
         * @param nodes Nodes which should be deleted
         * @param permanently Force permanently remove
         * @param silent No user-approving will be required
         */
        async delete({state, rootState}, {nodes, permanently = false, silent = false}) {
            const sprm = rootState.settings.user.immediateDeletion;
            const prm = permanently || nodes.every(v => v.bin);

            const finalize = () => {

                // Clear clipboard
                this.commit('clipboard/clear');

                return this.dispatch('fetch', {
                    route: (prm || sprm) ? 'delete' : 'moveToBin',
                    body: {
                        apikey: rootState.auth.apikey,
                        nodes: nodes.map(v => v.id)
                    }
                }).then(() => {

                    // Update nodes locally to save ressources
                    nodes.forEach(function rm(node) {
                        if (node.type === 'dir') {
                            for (let i = 0; i < state.length; i++) {
                                if (state[i].parent === node.id) {
                                    rm(state[i]);
                                    prm && (i = 0);
                                }
                            }
                        }

                        if (prm || sprm) {
                            const idx = state.indexOf(node);
                            state.splice(idx, 1);
                        } else {
                            node._subBin = true;
                        }
                    });

                    if (!prm && !sprm) {
                        nodes.forEach(v => {
                            v.bin = true;
                            v.lastModified = Date.now();
                        });

                        websocket.broadcast('nodes', 'change', nodes.map(v => pick(v, 'id', 'bin', 'lastModified')));
                    } else {
                        websocket.broadcast('nodes', 'delete', nodes.map(v => v.id));
                    }

                    state.splice(0, state.length, ...state);
                });
            };

            if (prm && !silent) {

                // Show warning
                this.commit('dialogbox/show', {
                    title: 'Delete forever',
                    text: 'Are you sure? This action cannot be undone.',
                    buttons: [
                        {type: 'cancel', text: 'Cancel'},
                        {type: 'accept', text: 'Okay'}
                    ],
                    onResolve: index => index && finalize()
                });
            } else {
                finalize();
            }
        },

        /**
         * Restores nodes from bin
         *
         * @param state
         * @param rootState
         * @param nodes
         * @returns {Promise<void>}
         */
        async restore({state, rootState}, nodes) {
            return this.dispatch('fetch', {
                route: 'restoreFromBin',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id)
                }
            }).then(() => {

                // Update nodes locally to save ressources
                nodes.forEach(function rm(node) {
                    if (node.type === 'dir') {
                        for (let i = 0; i < state.length; i++) {
                            if (state[i].parent === node.id) {
                                rm(state[i]);
                            }
                        }
                    }

                    node._subBin = false;
                });

                nodes.forEach(v => {
                    v.bin = false;
                    v.lastModified = Date.now();
                });

                websocket.broadcast('nodes', 'change', nodes.map(v => pick(v, 'id', 'bin', 'lastModified')));
                state.splice(0, state.length, ...state);
            });
        },

        /**
         * Marks nodes. Can be viewed in the marked menu-section.
         * @param rootState
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
                nodes.forEach(v => {
                    v.marked = true;
                    v.lastModified = Date.now();
                });

                websocket.broadcast('nodes', 'change', nodes.map(v => pick(v, 'id', 'marked', 'lastModified')));
            });
        },

        /**
         * Removes a mark from nodes.
         * @param rootState
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
                nodes.forEach(v => {
                    v.marked = false;
                    v.lastModified = Date.now();
                });

                websocket.broadcast('nodes', 'change', nodes.map(v => pick(v, 'id', 'marked', 'lastModified')));
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

                websocket.broadcast('nodes', 'change', [pick(node, 'id', 'lastModified', 'name')]);
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
                nodes.forEach(v => {
                    v.color = color;
                    v.lastModified = Date.now();
                });

                websocket.broadcast('nodes', 'change', nodes.map(v => pick(v, 'id', 'color', 'lastModified')));
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

                websocket.broadcast('nodes', 'change', [pick(node, 'id', 'staticIds')]);
                return id;
            });
        },

        /**
         * Removes static id's
         * @param rootState
         * @param ids
         * @param node
         */
        async removeStaticIds({state, rootState}, {ids}) {
            return this.dispatch('fetch', {
                route: 'removeStaticIds',
                body: {
                    apikey: rootState.auth.apikey,
                    ids
                }
            }).then(() => {
                const changedNodes = [];

                // Update nodes
                for (const node of state) {
                    node.staticIds = node.staticIds || [];

                    const previousIds = node.staticIds.length;
                    node.staticIds = node.staticIds.filter(id => !ids.includes(id));

                    // Check if any changes where made
                    if (previousIds.length !== node.staticIds) {
                        changedNodes.push(pick(node, 'id', 'staticIds'));
                    }
                }

                websocket.broadcast('nodes', 'change', changedNodes);
            });
        },

        /**
         * Creates a zip-file out of a bunch of nodes
         * @param state
         * @param rootState
         * @param nodes
         * @returns {Promise<void>}
         */
        async zip({state, rootState}, {nodes}) {
            return this.dispatch('fetch', {
                route: 'zip',
                body: {
                    apikey: rootState.auth.apikey,
                    nodes: nodes.map(v => v.id)
                }
            }).then(({node}) => {
                state.push(node);
                websocket.broadcast('nodes', 'put', [node]);
                return node;
            });
        }
    }
};
