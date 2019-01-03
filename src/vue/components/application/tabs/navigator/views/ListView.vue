<template>
    <section class="list-view">

        <!-- Table header -->
        <div v-if="nodes.dir.length || nodes.file.length" class="header">
            <i class="fas fa-fw" style="opacity: 0">folder</i>

            <div class="name" @click="sort('name')">
                <span>Name</span>
                <i :class="`sort fas fa-fw fa-caret-${sortDirs.name ? 'down' : 'up'}`"></i>
            </div>

            <div class="detail" @click="sort('lastModified')">
                <span>Last modified</span>
                <i :class="`sort fas fa-fw fa-caret-${sortDirs.lastModified ? 'down' : 'up'}`"></i>
            </div>

            <div class="detail" @click="sort('size')">
                <span>Size</span>
                <i :class="`sort fas fa-fw fa-caret-${sortDirs.size ? 'down' : 'up'}`"></i>
            </div>
        </div>

        <div class="list">

            <!-- Folders -->
            <div v-double-click="() => updateLocation(node)"
                 v-for="node of nodes.dir"
                 :class="{selected: node.selected, dir: 1, cutted: node.cutted}"
                 :data-hash="node.id"
                 @touchstart="select($event, node)"
                 @click.left="select($event, node)"
                 @click.right="select($event, node)">

                <i :style="{color: node.color}" class="fas fa-fw fa-folder"></i>

                <div class="name" spellcheck="false">
                    <span v-select-all="node.editable"
                          :contenteditable="node.editable"
                          @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
                    <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                </div>

                <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
                <span class="detail">{{ node.size | readableByteCount }}</span>
            </div>

            <!-- Files -->
            <div v-double-click="() => $store.commit('filepreview/show', {nodes: nodes.file, index})"
                 v-for="(node, index) of nodes.file"
                 :class="{selected: node.selected, file: 1, cutted: node.cutted}"
                 :data-hash="node.id"
                 @touchstart="select($event, node)"
                 @click.left="select($event, node)"
                 @click.right="select($event, node)">

                <i class="fas fa-fw fa-file"></i>
                <div class="name" spellcheck="false">
                    <span v-select-all="node.editable"
                          :contenteditable="node.editable"
                          @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
                    <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                </div>

                <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
                <span class="detail">{{ node.size | readableByteCount }}</span>
            </div>
        </div>

    </section>
</template>

<script>

    export default {
        props: {
            nodes: {
                type: Object,
                default: () => ({file: [], dir: []})
            }
        },

        data() {
            return {
                sortDirs: {
                    name: false,
                    lastModified: false,
                    size: false
                }
            };
        },

        methods: {

            updateLocation(node) {
                this.$store.commit('setActiveTab', 'home');
                this.$store.commit('location/update', node);
            },

            renameNode(evt, node) {
                this.$store.commit('editable/clear');
                this.$store.dispatch('nodes/rename', {
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
                    const nodes = this.nodes.dir.concat(this.nodes.file);

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
            },

            sort(type) {

                /**
                 * Values which are used to toggle
                 * each sorting type individually.
                 */
                const ra = this.sortDirs[type] ? -1 : 1;
                const rb = this.sortDirs[type] ? 1 : -1;

                // Find correct sorting function
                const sortFn = (() => {
                    switch (type) {
                        case 'name':
                            return (a, b) => a.name > b.name ? ra : rb;
                        case 'lastModified':
                            return (a, b) => a.lastModified > b.lastModified ? ra : rb;
                        case 'size':
                            return (a, b) => a.size > b.size ? ra : rb;
                    }
                })();

                // Sort pre-calulated nodes and re-render everything
                this.nodes.file.sort(sortFn);
                this.nodes.dir.sort(sortFn);
                this.$forceUpdate();

                // Toggle sort-direction to descending / ascending
                this.sortDirs[type] = !this.sortDirs[type];
            }
        }
    };

</script>

<style lang="scss" scoped>

    .list-view {
        @include flex(column);
    }

    .list {
        flex-grow: 1;
        overflow: auto;
    }

    .dir,
    .file,
    .header {
        @include flex(row, center);
        user-select: none;
        padding: 0.45em 0 0.25em;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.8em;

        i {
            color: $palette-deep-blue;
            transition: all 0.3s;
            font-size: 1.25em;
            margin-bottom: 0.2em;
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
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            span[contenteditable=true] {
                border-color: $palette-deep-purple;
                cursor: text;
                outline: none;
            }

            .bookmark {
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
        margin-top: 1.5em;
        padding-bottom: 1em;

        .name,
        .detail {
            @include flex(row, center);
            font-weight: 600;

            &:hover {
                color: $palette-deep-purple;

                .sort {
                    color: $palette-deep-purple;
                }
            }

            .sort {
                font-size: 1em;
                margin-left: 0.25em;
            }
        }
    }

</style>
