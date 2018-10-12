<template>
    <div id="app">
        <main-content></main-content>
    </div>
</template>

<script>

    // Global filters
    import './filters';

    // Components
    import MainContent from './components/main-content/MainContent';

    export default {

        components: {MainContent},

        data() {
            return {};
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
                const genFileName = () => `${random(fileNames)}.${random(fileExtension)}`;
                const genFolderName = () => random(folderNames);

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
                        type: Math.random() < 0.5 ? 'file' : 'folder',
                        lastModified: Math.floor(Math.random() * Date.now())
                    };

                    node.name = `${node.type}-${genHash().substring(0, 3)}`;

                    // Fill folder
                    if (node.type === 'folder') {
                        node.name = genFolderName();
                        generateNodes(maxDirectChilds, node.hash, depth - 1);
                    } else {
                        node.name = genFileName();
                        node.size = Math.floor(Math.random() * 1000000000); // Maximal 5GB
                    }

                    // Save node
                    nodes.push(node);
                }
            })(10, root.hash, 4); // Trigger recursive generating


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

    // Actual app layout
    html,
    body {
        height: 100%;
        width: 100%;
    }

    body {
        background: $palette-white-bright;
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
    }
</style>
