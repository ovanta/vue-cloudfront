<template>
    <section class="list-view">

        <!-- Table header -->
        <div class="header" v-if="nodes.folder.length || nodes.file.length">
            <i class="fas fa-fw" style="opacity: 0">folder</i>
            <span class="name">Name</span>
            <span class="detail">Last modified</span>
            <span class="detail">Size</span>
        </div>

        <div class="list">

            <!-- Folders -->
            <div v-for="node of nodes.folder"
                 :class="{selected: node.selected, folder: 1, cutted: node.cutted}"
                 :data-hash="node.hash"
                 @dblclick="updateLocation(node.hash)"
                 @click.right="select($event, node)"
                 @click.left="select($event, node)">

                <i class="fas fa-fw fa-folder" :style="{color: node.color}"></i>

                <div class="name" :contenteditable="node.editable" spellcheck="false" @keydown.enter.prevent="renameNode($event, node)"
                     v-select-all="node.editable">
                    <span>{{ node.name }}</span>
                    <i :class="{'fas fa-fw fa-thumbtack': 1, visible: node.starred}" :style="{color: node.color}"></i>
                </div>


                <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
                <span class="detail">{{ node.size | readableByteCount }}</span>
            </div>

            <!-- Files -->
            <div v-for="node of nodes.file"
                 :class="{selected: node.selected, file: 1, cutted: node.cutted}"
                 :data-hash="node.hash"
                 @click.right="select($event, node)"
                 @click.left="select($event, node)">

                <i class="fas fa-fw fa-file"></i>
                <div class="name" :contenteditable="node.editable" spellcheck="false" @keydown.enter.prevent="renameNode($event, node)"
                     v-select-all="node.editable">
                    <span>{{ node.name }}</span>
                    <i :class="{'fas fa-fw fa-thumbtack': 1, visible: node.starred}" :style="{color: node.color}"></i>
                </div>

                <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
                <span class="detail">{{ node.size | readableByteCount }}</span>
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

                function calcFolderSize(hash) {
                    let size = 0;

                    // Find childrens of current location
                    for (let i = 0, n; n = stateNodes[i], i < stateNodesAmount; i++) {
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
                for (let i = 0, n; n = stateNodes[i], i < stateNodesAmount; i++) {

                    // Check if parent is the current location
                    if (search.active || n.parent === locHash) {
                        const {type} = n;

                        // Pre-checks
                        n.cutted = clipboardNodes.includes(n);
                        n.selected = selectionNodes.includes(n);
                        n.editable = n === editableNode;
                        nodes[type].push(n);

                        // Calculate recursivly the size of each folder
                        if (type === 'folder') {
                            n.size = calcFolderSize(n.hash);
                        }
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

    .list-view {
        @include flex(column);
    }

    .list {
        flex-shrink: 1;
        overflow: auto;
    }

    .header {
        flex-shrink: 0;
        margin-top: 1.5em;
    }

    .folder,
    .file,
    .header {
        @include flex(row, center);
        user-select: none;
        padding: 0.4em 0;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.8em;

        i {
            color: $palette-deep-blue;
            transition: all 0.3s;
        }

        &.selected {

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
            transition: all 0.3s;
        }

        .name {
            width: 100%;
            margin: 0 0.5em;
            padding: 0.15em 0 0.15em 0.25em;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;

            &[contenteditable=true] {
                border-color: $palette-deep-purple;
                cursor: text;
                outline: none;
            }

            .fa-thumbtack {
                font-size: 0.9em;
                margin-left: 0.5em;

                opacity: 0;
                transform: translateY(-0.15em) rotate(10deg);
                transition: all 0.3s;

                &.visible {
                    opacity: 1;
                    transform: none;
                }
            }
        }

        .detail {
            width: 60%;
            opacity: 0.8;
        }

        &:nth-last-child(1) {
            border-bottom: none;
        }
    }

    .header {
        font-weight: 600;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.1);
    }

</style>
