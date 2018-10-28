<template>
    <div id="app" @contextmenu="preventDefault">
        <search-bar></search-bar>
        <main-content></main-content>
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

    export default {

        components: {MainContent, SearchBar},

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
            const nodes = [];

            // Root hash
            const root = {
                hash: genHash(),
                type: 'folder',
                name: 'Home'
            };

            nodes.push(root);

            // Generate random nodes (children)
            (function generateNodes(maxDirectChilds, parent, depth) {

                // File / folder names
                const fileNames = ['Test', 'Holiday', 'Timetable', 'Todos', 'Web-App ideas', 'Receips', 'Keys', 'Discord', 'Apple-Presentation', 'Earnings', 'Passwords', 'Application'];
                const fileExtension = ['', 'mp4', 'mp4', 'webm', 'docx', 'pptx', 'txt', 'json', 'zip', 'rar', 'csv'];
                const folderNames = ['Downloads', 'University', 'School', 'Projects - GitHub', 'Todos', 'Private', 'Videos', 'Movies', 'Images', 'Documents', 'Music'];
                const folderColors = ['EF5350', '#EC407A', '#AB47BC', '#7E57C2', '#5C6BC0', '#42A5F5', '#29B6F6', '#26C6DA', '#26A69A', '#66BB6A', '#9CCC65', '#D4E157', '#FFEE58', '#FFCA28', '#FFA726', '#FF7043', '#8D6E63', '#BDBDBD', '#78909C'];
                const genFileName = () => `${random(fileNames)}.${random(fileExtension)}`;
                const genFolderName = () => random(folderNames);
                const genFolderColor = () => random(folderColors);

                // Check tree can go deeper
                if (depth === 0) {
                    return;
                }

                // Randomize children count
                const to = Math.random() * maxDirectChilds;
                for (let i = 0; i < to; i++) {

                    // Generate node
                    const node = {
                        hash: genHash(),
                        parent: parent,
                        type: Math.random() < 0.75 ? 'file' : 'folder',
                        lastModified: Math.floor(Math.random() * Date.now())
                    };

                    node.name = `${node.type}-${genHash().substring(0, 3)}`;

                    // Fill folder
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
            })(25, root.hash, 5); // Trigger recursive generating

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
        position: fixed;
        margin: auto;
        display: flex;
        flex-direction: column;
        user-select: none;
        @include position(0, 0, 0, 0);
        @include width(70vw, 0, 1400px);
        @include height(90vh, 0, 950px);
        border-radius: 0.5em;
        box-shadow: 0 0.4em 2.5em 0 rgba($palette-deep-blue, 0.13);
        overflow: hidden;
    }

    .selection-area {
        background: rgba($palette-cloud-blue, 0.02);
        border: 1px solid rgba($palette-cloud-blue, 0.6);
    }
</style>
