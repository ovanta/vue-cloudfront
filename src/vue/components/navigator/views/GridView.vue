<template>
    <section class="grid-view">

        <div class="list">

            <h1 v-if="nodes.folder.length">Folders</h1>

            <!-- Folders and files -->
            <div class="grid-container">
                <div v-for="node of nodes.folder"
                     :class="{selected: node.selected, folder: 1, cutted: node.cutted}"
                     :data-hash="node.hash"
                     @dblclick="updateLocation(node.hash)"
                     @click.right="select($event, node)"
                     @click.left="select($event, node)">

                    <i class="material-icons" :style="{color: node.color}">folder</i>
                    <span class="name"
                          :contenteditable="node.editable"
                          spellcheck="false"
                          @keydown.enter.prevent="renameNode($event, node)"
                          v-select-all="node.editable">{{ node.name }}</span>
                </div>
            </div>

            <h1 v-if="nodes.file.length">Files</h1>

            <div class="grid-container">
                <div v-for="node of nodes.file"
                     :class="{selected: node.selected, file: 1, cutted: node.cutted}"
                     :data-hash="node.hash"
                     @click.right="select($event, node)"
                     @click.left="select($event, node)">

                    <i class="material-icons">insert_drive_file</i>
                    <span class="name"
                          :contenteditable="node.editable"
                          spellcheck="false"
                          @keydown.enter.prevent="renameNode($event, node)"
                          v-select-all="node.editable">{{ node.name }}</span>
                </div>
            </div>
        </div>

    </section>
</template>

<script>

    export default {

        computed: {

            nodes() {
                const state = this.$store.state;
                const selectionNodes = state.selection;
                const clipboardNodes = state.clipboard.nodes;
                const editableNode = state.editable.node;
                const search = state.search;

                const stateNodes = search.active ? search.nodes : state.nodes;
                const stateNodesAmount = stateNodes.length;

                const locHash = this.$store.getters['location/currentLocation'];
                const nodes = {file: [], folder: []}; // Seperate files and folders

                // Find folder and files which has the current locations as parent
                for (let i = 0, n; n = stateNodes[i], i < stateNodesAmount; i++) {

                    // Check if parent is the current location
                    if (search.active || n.parent === locHash) {
                        const {type} = n;

                        // Pre-checks
                        n.cutted = clipboardNodes.includes(n);
                        n.selected = selectionNodes.includes(n);
                        n.editable = n === editableNode;
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
                this.$store.commit('editable/reset');
                this.$store.commit('nodes/rename', {
                    node,
                    newName: evt.target.innerHTML
                });
            },

            select(evt, node) {
                const state = this.$store.state;

                /**
                 * Clear selection if
                 *  - User hasn't pressed the ctrlKey and used NOT right click (which would open the menu)
                 *  - User used right click AND the node isn't already selected
                 */
                if ((!evt.ctrlKey && evt.button !== 2) ||
                    (evt.button === 2 && !state.selection.includes(node))) {
                    this.$store.commit('selection/clear');
                } else if (evt.ctrlKey && evt.shiftKey) {

                    // Select all nodes from 0 or an already selected to the target node
                    const selection = state.selection;
                    const nodes = this.nodes.folder.concat(this.nodes.file);

                    // Find start and end point
                    const [start, end] = [
                        selection.length ? nodes.indexOf(selection[0]) : 0,
                        nodes.indexOf(node)
                    ].sort((a, b) => a - b);

                    // Append rage-nodes to selection
                    this.$store.commit('selection/append', nodes.slice(start, end + 1));
                    return;
                }

                // Toggle
                const action = evt.button !== 2 && state.selection.includes(node) ? 'remove' : 'append';
                this.$store.commit(`selection/${action}`, [node]);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .grid-view {
        @include flex(column);
    }

    .list {
        flex-shrink: 1;
        overflow: auto;
        padding-bottom: 0.5em;
    }

    h1 {
        position: relative;
        display: inline-block;
        font-size: 0.95em;
        color: $palette-deep-blue;
        padding: 0.15em 0.5em 0.25em;
        border-radius: 0.15em;
        margin: 1.5em 0 0.2em;
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
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.8em;
        box-shadow: 0 1px 3px 0 rgba(black, 0.05);
        background: white;
        border: 1px solid transparent;

        i {
            color: $palette-deep-blue;
            transition: all 0.3s;
        }

        &.selected {
            border-color: rgba($palette-cloud-blue, 0.5);
            box-shadow: 0 1px 8px 0 rgba($palette-cloud-blue, 0.15);

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
