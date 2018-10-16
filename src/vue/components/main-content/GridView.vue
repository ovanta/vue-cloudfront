<template>
    <section class="grid-view">


        <h1 v-if="nodes.folder.length">Folders</h1>

        <!-- Folders and files -->
        <div class="grid-container">
            <div v-for="node of nodes.folder"
                 :class="{selectable: 1, folder: 1, cutted: node.cutted}"
                 @dblclick="updateLocation(node.hash)"
                 :data-hash="node.hash">

                <i class="material-icons" :style="{color: node.color}">folder</i>
                <span class="name" :contenteditable="node.editable" spellcheck="false" @keydown.enter.prevent="renameNode($event, node)"
                      v-select-all="node.editable">{{ node.name }}</span>
            </div>
        </div>

        <h1 v-if="nodes.file.length">Files</h1>

        <div class="grid-container">
            <div v-for="node of nodes.file"
                 :class="{selectable: 1, file: 1, cutted: node.cutted}"
                 :data-hash="node.hash">

                <i class="material-icons">insert_drive_file</i>
                <span class="name" :contenteditable="node.editable" spellcheck="false" @keydown.enter.prevent="renameNode($event, node)"
                      v-select-all="node.editable">{{ node.name }}</span>
            </div>
        </div>

    </section>
</template>


<script>

    export default {

        computed: {

            nodes() {
                const stateNodes = this.$store.state.nodes;
                const stateNodesAmount = stateNodes.length;

                const loc = this.$store.state.location;
                const locHash = loc[loc.length - 1];
                const nodes = {file: [], folder: []}; // Seperate files and folders

                // Find folder and files which has the current locations as parent
                for (let i = 0, n; n = stateNodes[i], i < stateNodesAmount; i++) {

                    // Check if parent is the current location
                    if (n.parent === locHash) {
                        const {type} = n;
                        nodes[type].push(n);
                    }
                }

                return nodes;
            }

        },

        data() {
            return {};
        },

        methods: {

            updateLocation(hash) {
                this.$store.commit('location/update', hash);
            },

            renameNode(evt, node) {
                node.editable = false;
                this.$store.commit('nodes/rename', {
                    node,
                    newName: evt.target.innerHTML
                });
            }

        }

    };

</script>

<style lang="scss" scoped>

    h1 {
        font-size: 1em;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.08);
        padding: 0.8em 0 0.2em;
        margin-bottom: 0.75em;
        font-weight: 400;
        color: $palette-deep-blue;
    }

    .grid-container {
        @include flex(row, flex-start);
        flex-wrap: wrap;
    }

    .folder,
    .file {
        position: relative;
        @include flex(row, center);
        padding: 0.5em 0.9em;
        margin: 0.5em 0.5em 0 0;
        border-radius: 0.15em;
        border: 1px solid rgba($palette-deep-blue, 0.08);
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.8em;

        i {
            color: $palette-deep-blue;
            transition: all 0.3s;
        }

        &.selected {
            background: rgba($palette-cloud-blue, 0.05);
            border-color: rgba($palette-cloud-blue, 0.5);

            .name,
            .detail,
            i {
                color: $palette-cloud-blue;
            }
        }

        &.cutted {
            opacity: 0.75;
        }

        .name,
        .detail {
            color: $palette-deep-blue;
        }

        .name {
            width: 100%;
            margin: 0 0.5em;
            padding: 0.15em 0 0.15em;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;

            &[contenteditable=true] {
                border-color: $palette-cloud-blue;
                cursor: text;
                outline: none;
            }
        }
    }
</style>
