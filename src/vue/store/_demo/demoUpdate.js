const genID = () => Math.round(Math.random() * 1e13).toString(16);
const random = arr => arr[Math.floor(Math.random() * arr.length)];
const names = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Curabitur', 'Vel', 'Hendrerit', 'Libero', 'Eleifend', 'Blandit', 'Nunc', 'Ornare', 'Odio', 'Ut', 'Orci', 'Gravida', 'Imperdiet', 'Nullam', 'Purus', 'Lacinia', 'A', 'Pretium', 'Quis', 'Congue', 'Praesent', 'Sagittis', 'Laoreet', 'Auctor', 'Mauris', 'Non', 'Velit', 'Eros', 'Dictum', 'Proin', 'Accumsan', 'Sapien', 'Nec', 'Massa', 'Volutpat', 'Venenatis', 'Sed', 'Eu', 'Molestie', 'Lacus', 'Quisque', 'Porttitor', 'Ligula', 'Dui', 'Mollis', 'Tempus', 'At', 'Magna', 'Vestibulum', 'Turpis', 'Ac', 'Diam', 'Tincidunt', 'Id', 'Condimentum', 'Enim', 'Sodales', 'In', 'Hac', 'Habitasse', 'Platea', 'Dictumst', 'Aenean', 'Neque', 'Fusce', 'Augue', 'Leo', 'Eget', 'Semper', 'Mattis', 'Tortor', 'Scelerisque', 'Nulla', 'Interdum', 'Tellus', 'Malesuada', 'Rhoncus', 'Porta', 'Sem', 'Aliquet', 'Et', 'Nam', 'Suspendisse', 'Potenti', 'Vivamus', 'Luctus', 'Fringilla', 'Erat', 'Donec', 'Justo', 'Vehicula', 'Ultricies', 'Varius', 'Ante', 'Primis', 'Faucibus', 'Ultrices', 'Posuere', 'Cubilia', 'Curae', 'Etiam', 'Cursus', 'Aliquam', 'Quam', 'Dapibus', 'Nisl', 'Feugiat', 'Egestas', 'Class', 'Aptent', 'Taciti', 'Sociosqu', 'Ad', 'Litora', 'Torquent', 'Per', 'Conubia', 'Nostra', 'Inceptos', 'Himenaeos', 'Phasellus', 'Nibh', 'Pulvinar', 'Vitae', 'Urna', 'Iaculis', 'Lobortis', 'Nisi', 'Viverra', 'Arcu', 'Morbi', 'Pellentesque', 'Metus', 'Commodo', 'Ut', 'Facilisis', 'Felis', 'Tristique', 'Ullamcorper', 'Placerat', 'Aenean', 'Convallis', 'Sollicitudin', 'Integer', 'Rutrum', 'Duis', 'Est', 'Etiam', 'Bibendum', 'Donec', 'Pharetra', 'Vulputate', 'Maecenas', 'Mi', 'Fermentum', 'Consequat', 'Suscipit', 'Aliquam', 'Habitant', 'Senectus', 'Netus', 'Fames', 'Quisque', 'Euismod', 'Curabitur', 'Lectus', 'Elementum', 'Tempor', 'Risus', 'Cras'];
const fileExtension = ['asp', 'css', 'cfm', 'yaws', 'jsp', 'jspx', 'wss', 'do', 'xls', 'rb', 'cgi', 'swf'];
const folderColors = ['#EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'];

const genFileName = () => `${random(names)}.${random(fileExtension)}`;
const genFolderName = () => random(names);
const genFolderColor = () => random(folderColors);

export default ({maxDirectChilds = 30, depth = 5} = {}) => {
    const newNodes = [];

    /**
     * Defines the entry point of the entire application, type need
     * to be folder where name should be Home.
     */
    const root = {
        id: 'root',
        type: 'dir',
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
     *     id: <String> // Unique id of node
     *     parent: <String> // Parent id
     *     lastModified: <Number> // Last modified timestamp
     *     type: 'dir' | 'file' // Node type
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
                    id: genID(),
                    parent: parent,
                    type: Math.random() < 0.6 ? 'file' : 'dir',
                    lastModified: Math.floor(Math.random() * Date.now()),
                    marked: false
                };

                // File / folder specific attributes
                if (node.type === 'dir') {
                    node.color = genFolderColor();
                    node.name = genFolderName();
                    generateNodes(maxDirectChilds, node.id, depth - 1);
                } else {
                    node.name = genFileName();
                    node.size = Math.floor(Math.random() * 1000000000); // Maximal 5GB
                }

                // Save node
                newNodes.push(node);
            }
        }
    })(maxDirectChilds, root.id, depth); // Trigger recursive generating

    return {
        nodes: newNodes,
        root
    };
}
