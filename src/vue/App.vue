<template>
    <div id="app" @contextmenu="preventDefault">

        <!-- Main app components -->
        <search-bar></search-bar>
        <main-content></main-content>

        <!-- Debug screen -->
        <debug-screen></debug-screen>

        <!-- Helping pages -->
        <shortcuts-help-page></shortcuts-help-page>
        <filter-help-page></filter-help-page>

        <!-- Background shapes -->
        <div class="background">
            <svg class="left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <path d="M0,0V500H124.914s53.473-56.5,74.963-175S124.914,0,124.914,0H0Z"></path>
            </svg>

            <svg class="right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <path d="M325.529,500s-50.117-80.37,50.118-124.8S500,350,500,350V500H325.529Z"></path>
            </svg>
        </div>
    </div>
</template>

<script>

    // Global filters
    import './filters';

    // Global directives
    import './directives';

    // Global mixins
    import './mixins';

    // Components
    import MainContent from './components/navigator/Navigator';
    import SearchBar from './components/SearchBar';
    import DebugScreen from './components/DebugScreen';

    // Helping screens
    import ShortcutsHelpPage from './components/help/ShortcutsHelpPage';
    import FilterHelpPage from './components/help/FilterHelpPage';

    import '@fortawesome/fontawesome-free/css/all.css';

    export default {

        components: {MainContent, SearchBar, DebugScreen, ShortcutsHelpPage, FilterHelpPage},

        data() {
            return {};
        },

        methods: {

            preventDefault(e) {
                e.preventDefault();
            }

        },

        mounted() {

            // Generate random data
            const genHash = () => Math.round(Math.random() * 1e13).toString(16);
            const random = arr => arr[Math.floor(Math.random() * arr.length)];
            const names = ['Lorem', 'Ipsum', 'Dolor', 'Sit', 'Amet', 'Consectetur', 'Adipiscing', 'Elit', 'Curabitur', 'Vel', 'Hendrerit', 'Libero', 'Eleifend', 'Blandit', 'Nunc', 'Ornare', 'Odio', 'Ut', 'Orci', 'Gravida', 'Imperdiet', 'Nullam', 'Purus', 'Lacinia', 'A', 'Pretium', 'Quis', 'Congue', 'Praesent', 'Sagittis', 'Laoreet', 'Auctor', 'Mauris', 'Non', 'Velit', 'Eros', 'Dictum', 'Proin', 'Accumsan', 'Sapien', 'Nec', 'Massa', 'Volutpat', 'Venenatis', 'Sed', 'Eu', 'Molestie', 'Lacus', 'Quisque', 'Porttitor', 'Ligula', 'Dui', 'Mollis', 'Tempus', 'At', 'Magna', 'Vestibulum', 'Turpis', 'Ac', 'Diam', 'Tincidunt', 'Id', 'Condimentum', 'Enim', 'Sodales', 'In', 'Hac', 'Habitasse', 'Platea', 'Dictumst', 'Aenean', 'Neque', 'Fusce', 'Augue', 'Leo', 'Eget', 'Semper', 'Mattis', 'Tortor', 'Scelerisque', 'Nulla', 'Interdum', 'Tellus', 'Malesuada', 'Rhoncus', 'Porta', 'Sem', 'Aliquet', 'Et', 'Nam', 'Suspendisse', 'Potenti', 'Vivamus', 'Luctus', 'Fringilla', 'Erat', 'Donec', 'Justo', 'Vehicula', 'Ultricies', 'Varius', 'Ante', 'Primis', 'Faucibus', 'Ultrices', 'Posuere', 'Cubilia', 'Curae', 'Etiam', 'Cursus', 'Aliquam', 'Quam', 'Dapibus', 'Nisl', 'Feugiat', 'Egestas', 'Class', 'Aptent', 'Taciti', 'Sociosqu', 'Ad', 'Litora', 'Torquent', 'Per', 'Conubia', 'Nostra', 'Inceptos', 'Himenaeos', 'Phasellus', 'Nibh', 'Pulvinar', 'Vitae', 'Urna', 'Iaculis', 'Lobortis', 'Nisi', 'Viverra', 'Arcu', 'Morbi', 'Pellentesque', 'Metus', 'Commodo', 'Ut', 'Facilisis', 'Felis', 'Tristique', 'Ullamcorper', 'Placerat', 'Aenean', 'Convallis', 'Sollicitudin', 'Integer', 'Rutrum', 'Duis', 'Est', 'Etiam', 'Bibendum', 'Donec', 'Pharetra', 'Vulputate', 'Maecenas', 'Mi', 'Fermentum', 'Consequat', 'Suscipit', 'Aliquam', 'Habitant', 'Senectus', 'Netus', 'Fames', 'Quisque', 'Euismod', 'Curabitur', 'Lectus', 'Elementum', 'Tempor', 'Risus', 'Cras'];
            const fileExtension = ['asp', 'css', 'cfm', 'yaws', 'jsp', 'jspx', 'wss', 'do', 'xls', 'rb', 'cgi', 'swf'];
            const folderColors = ['EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'];

            const genFileName = () => `${random(names)}.${random(fileExtension)}`;
            const genFolderName = () => random(names);
            const genFolderColor = () => random(folderColors);
            const nodes = [];

            /**
             * Defines the entry point of the entire application, type need
             * to be folder where name should be Home.
             */
            const root = {
                hash: genHash(),
                type: 'folder',
                name: 'Home'
            };

            // Entry point also needs to be on the list
            nodes.push(root);

            /**
             * Recursive function to generate random nodes.
             * Structure of a node:
             *
             * // Generally
             * let node = {
             *     hash: <String> // Unique id of node
             *     parent: <String> // Parent id
             *     type: 'folder' | 'file' // Node type
             *     name: <String> // Folder / filename,
             *     starred: <Boolean> // If marked
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
                            type: Math.random() < 0.9 ? 'file' : 'folder',
                            lastModified: Math.floor(Math.random() * Date.now()),
                            starred: false
                        };

                        // File / folder specific attributes
                        if (node.type === 'folder') {
                            node.name = genFolderName();
                            node.color = genFolderColor();
                            generateNodes(maxDirectChilds, node.hash, depth - 1);
                        } else {
                            node.name = genFileName();
                            node.size = Math.floor(Math.random() * 1000000000); // Maximal 5GB
                        }

                        // Save node
                        nodes.push(node);
                    }
                }
            })(50, root.hash, 4); // Trigger recursive generating

            console.log(`[INI] ${nodes.length} Nodes generated.`);
            this.$store.commit('nodes/update', nodes);
            this.$store.commit('location/update', root.hash);
        }
    };
</script>


<style lang="scss">

    // Some resets
    button,
    textarea,
    input {
        font-family: $font-family-open-sans;
        outline: none;
        border: none;
        background: transparent;
    }

    button {
        cursor: pointer;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    ::-webkit-scrollbar {
        width: 0.3em;
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: lighten($palette-grayish-blue, 10);
        border-radius: 0;
    }

    // Actual app layout
    html,
    body {
        height: 100%;
        width: 100%;
    }

    body {
        background: $palette-snow-white;
    }

    #app {
        font-family: $font-family-open-sans;
        position: absolute;
        margin: auto;
        display: flex;
        flex-direction: column;
        user-select: none;
        @include position(0, 0, 0, 0);
        @include width(70vw, 0, 1400px);
        @include height(90vh, 0, 950px);
        box-shadow: 0 0.4em 2.5em 0 rgba($palette-deep-blue, 0.13);
        border-radius: 0.5em;
        overflow: hidden;

        .background {

            svg {
                position: fixed;
                z-index: -1;
                @include size(100vmax);
                fill: $palette-bright-purple;
            }

            .left {
                left: 0;
                top: 0;
            }

            .right {
                right: 0;
                bottom: 0;

            }
        }
    }

    .selection-area {
        background: rgba($palette-cloud-blue, 0.02);
        border: 1px solid rgba($palette-cloud-blue, 0.6);
    }

    // Font awesome default size
    [class^='fa'] {
        font-size: 18px;
        line-height: 1;
        flex-shrink: 0;
    }
</style>
