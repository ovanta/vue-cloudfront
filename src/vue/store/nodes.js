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
         * @param state
         * @param destination Parent node
         */
        createFolder({state}, destination) {

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
         * Move nodes to another folder.
         * @param state
         * @param rootState
         * @param nodes Nodes which should be moved
         * @param destination Destination node
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

            // Check if user tries to put something into itself
            for (let i = 0; i < nodes.length; i++) {
                const subfolder = getSubFolders(nodes[i]);
                if (subfolder.includes(destination)) {
                    throw `Cannot perform 'move' in nodes. Cannot put a folder into itself`;
                }
            }

            // Move nodes
            nodes.forEach(n => n.parent = destination.hash);
        },

        /**
         * Copy a node tree into another folder
         * @param state
         * @param rootState
         * @param nodes Nodes which should be copied
         * @param destination Destination node
         */
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
                    if (n.parent === node.hash) {

                        // Copy sibling via spread syntax
                        siblings.push({...n});

                        if (n.type === 'folder') {
                            siblings.push(...cloneSiblings(n));
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
                    if (n.parent === destination.hash &&
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

                cloned.push(...cloneSiblings(n));
            }

            // Append cloned nodes
            state.push(...cloned);
        },

        /**
         * Updates / fetches nodes.
         * TODO: Replace with actual fetching / use local file for demo?
         * @param state
         */
        update({state}) {

            // Generate random data
            const genHash = () => Math.round(Math.random() * 1e13).toString(16);
            const random = arr => arr[Math.floor(Math.random() * arr.length)];
            const names = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Curabitur', 'Vel', 'Hendrerit', 'Libero', 'Eleifend', 'Blandit', 'Nunc', 'Ornare', 'Odio', 'Ut', 'Orci', 'Gravida', 'Imperdiet', 'Nullam', 'Purus', 'Lacinia', 'A', 'Pretium', 'Quis', 'Congue', 'Praesent', 'Sagittis', 'Laoreet', 'Auctor', 'Mauris', 'Non', 'Velit', 'Eros', 'Dictum', 'Proin', 'Accumsan', 'Sapien', 'Nec', 'Massa', 'Volutpat', 'Venenatis', 'Sed', 'Eu', 'Molestie', 'Lacus', 'Quisque', 'Porttitor', 'Ligula', 'Dui', 'Mollis', 'Tempus', 'At', 'Magna', 'Vestibulum', 'Turpis', 'Ac', 'Diam', 'Tincidunt', 'Id', 'Condimentum', 'Enim', 'Sodales', 'In', 'Hac', 'Habitasse', 'Platea', 'Dictumst', 'Aenean', 'Neque', 'Fusce', 'Augue', 'Leo', 'Eget', 'Semper', 'Mattis', 'Tortor', 'Scelerisque', 'Nulla', 'Interdum', 'Tellus', 'Malesuada', 'Rhoncus', 'Porta', 'Sem', 'Aliquet', 'Et', 'Nam', 'Suspendisse', 'Potenti', 'Vivamus', 'Luctus', 'Fringilla', 'Erat', 'Donec', 'Justo', 'Vehicula', 'Ultricies', 'Varius', 'Ante', 'Primis', 'Faucibus', 'Ultrices', 'Posuere', 'Cubilia', 'Curae', 'Etiam', 'Cursus', 'Aliquam', 'Quam', 'Dapibus', 'Nisl', 'Feugiat', 'Egestas', 'Class', 'Aptent', 'Taciti', 'Sociosqu', 'Ad', 'Litora', 'Torquent', 'Per', 'Conubia', 'Nostra', 'Inceptos', 'Himenaeos', 'Phasellus', 'Nibh', 'Pulvinar', 'Vitae', 'Urna', 'Iaculis', 'Lobortis', 'Nisi', 'Viverra', 'Arcu', 'Morbi', 'Pellentesque', 'Metus', 'Commodo', 'Ut', 'Facilisis', 'Felis', 'Tristique', 'Ullamcorper', 'Placerat', 'Aenean', 'Convallis', 'Sollicitudin', 'Integer', 'Rutrum', 'Duis', 'Est', 'Etiam', 'Bibendum', 'Donec', 'Pharetra', 'Vulputate', 'Maecenas', 'Mi', 'Fermentum', 'Consequat', 'Suscipit', 'Aliquam', 'Habitant', 'Senectus', 'Netus', 'Fames', 'Quisque', 'Euismod', 'Curabitur', 'Lectus', 'Elementum', 'Tempor', 'Risus', 'Cras'];
            const fileExtension = ['asp', 'css', 'cfm', 'yaws', 'jsp', 'jspx', 'wss', 'do', 'xls', 'rb', 'cgi', 'swf'];
            const folderColors = ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'];

            const genFileName = () => `${random(names)}.${random(fileExtension)}`;
            const genFolderName = () => random(names);
            const genFolderColor = () => random(folderColors);
            const newNodes = [];

            /**
             * Defines the entry point of the entire application, type need
             * to be folder where name should be Home.
             * TODO: Prevent it from being deleted!
             */
            const root = {
                hash: genHash(),
                type: 'folder',
                name: 'Home'
            };

            // Entry point also needs to be on the list
            newNodes.push(root);

            /**
             * Recursive function to generate random nodes.
             * Structure of a node:
             *
             * // Generally
             * let node = {
             *     hash: <String> // Unique id of node
             *     parent: <String> // Parent id
             *     lastModified: <Number> // Last modified timestamp
             *     type: 'folder' | 'file' // Node type
             *     name: <String> // Folder / filename,
             *     marked: <Boolean> // If marked
             * }
             *
             * // File specific
             * let fileNode = {
             *     ...node,
             *     size: <Number> // file size
             * }
             *
             * // Folder specific
             * let folderNode = {
             *     ...node,
             *     color: <String> // Color
             * }
             */
            (function generateNodes(maxDirectChilds, parent, depth) {

                // Check if max deph is reached
                if (depth > 0) {

                    // Randomize children count
                    const to = Math.random() * maxDirectChilds;
                    for (let i = 0; i < to; i++) {

                        // Generate node
                        const node = {
                            hash: genHash(),
                            parent: parent,
                            type: Math.random() < 0.6 ? 'file' : 'folder',
                            lastModified: Math.floor(Math.random() * Date.now()),
                            marked: false
                        };

                        // File / folder specific attributes
                        if (node.type === 'folder') {
                            node.color = genFolderColor();
                            node.name = genFolderName();
                            generateNodes(maxDirectChilds, node.hash, depth - 1);
                        } else {
                            node.name = genFileName();
                            node.size = Math.floor(Math.random() * 1000000000); // Maximal 5GB
                        }

                        // Save node
                        newNodes.push(node);
                    }
                }
            })(20, root.hash, 4); // Trigger recursive generating

            this.commit('location/update', root);
            state.splice(0, state.length, ...newNodes);
        },

        /**
         * Deletes nodes recursivly
         * @param state
         * @param nodes Nodes which should be deleted
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

        /**
         * Marks nodes. Can be viewed in the marked menu-section.
         * @param state
         * @param nodes Nodes which get a mark.
         */
        addMark({state}, nodes) {

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
         * Renames a node.
         * @param state
         * @param node The node which should be renamed
         * @param newName A new name.
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

        /**
         * Changes the color of folders.
         * @param state
         * @param nodes Nodes from which the color should be changed.
         * @param color A (basically) hex value like #fff (for white).
         */
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
