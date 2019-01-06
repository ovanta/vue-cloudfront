<template>
    <section class="grid-view">

        <div ref="list"
             class="list"
             @scroll="scroll">

            <!-- Folders -->
            <h1 v-if="nodes.dir.length">Folders</h1>
            <div class="grid-container">
                <div v-double-tap="() => updateLocation(node)"
                     v-for="node of croppedNodes.dir"
                     :class="{selected: node.selected, dir: 1, cutted: node.cutted}"
                     :data-hash="node.id"
                     @touchend="select($event, node)"
                     @click.left="select($event, node)"
                     @click.right="select($event, node)">

                    <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                    <i :style="{color: node.color}" class="fas fa-fw fa-folder"></i>
                    <span v-select-all="node.editable"
                          :contenteditable="node.editable"
                          class="name"
                          spellcheck="false"
                          @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
                </div>
            </div>

            <!-- Files -->
            <h1 v-if="nodes.file.length">Files</h1>
            <div class="grid-container">
                <div v-double-tap="() => $store.commit('filepreview/show', {nodes: nodes.file, index})"
                     v-for="(node, index) of croppedNodes.file"
                     :class="{selected: node.selected, file: 1, cutted: node.cutted}"
                     :data-hash="node.id"
                     @touchend="select($event, node)"
                     @click.left="select($event, node)"
                     @click.right="select($event, node)">

                    <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                    <span class="extension">{{ node.extension }}</span>
                    <span v-select-all="node.editable"
                          :contenteditable="node.editable"
                          class="name"
                          spellcheck="false"
                          @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
                </div>
            </div>
        </div>

    </section>
</template>

<script>

    // Config stuff
    import {visibleNodesLimit} from '../../../../../../../config/config';

    // Selectable plugin
    import Selectable from '../plugins/selectable';

    export default {
        props: {
            nodes: {
                type: Object,
                default: () => ({file: [], dir: []})
            }
        },

        data() {
            return {
                fileLimit: visibleNodesLimit,
                dirLimit: visibleNodesLimit
            };
        },

        computed: {
            croppedNodes() {
                const {fileLimit, dirLimit} = this;
                return {
                    file: this.nodes.file.slice(0, fileLimit),
                    dir: this.nodes.dir.slice(0, dirLimit)
                };
            }
        },

        watch: {
            nodes(newValue, oldValue) {

                // Mostly props get's changed. Update only if array lengths are changing
                if (newValue.dir.length === oldValue.dir.length && newValue.file.length === oldValue.file.length) {
                    return;
                }

                const listEl = this.$refs.list;
                this.dirLimit = visibleNodesLimit;
                this.fileLimit = visibleNodesLimit;

                const check = () => {
                    requestAnimationFrame(() => {
                        if (listEl.scrollHeight === listEl.offsetHeight && this.increaseVisibleArea()) {
                            check();
                        }
                    });
                };

                check();
            }
        },

        updated() {
            Selectable.resolveSelectables();
        },

        methods: {
            scroll({target}) {
                if (target.scrollHeight - (target.scrollTop + target.offsetHeight) < 25) {
                    this.increaseVisibleArea();
                }
            },

            increaseVisibleArea() {

                if (this.dirLimit < this.nodes.dir.length) {
                    this.dirLimit += visibleNodesLimit;
                    return true;
                }

                if (this.fileLimit < this.nodes.file.length) {
                    this.fileLimit += visibleNodesLimit;
                    return true;
                }

                return false;
            },

            updateLocation(node) {
                this.$store.commit('setActiveTab', 'home');
                this.$store.commit('location/update', node);
            },

            renameNode(evt, node) {
                this.$store.commit('editable/clear');

                // Try to rename, restore previous value if failed
                this.$store.dispatch('nodes/rename', {
                    node,
                    newName: evt.target.innerHTML
                }).catch(() => {
                    evt.target.innerHTML = node.name;
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
            }
        }
    };

</script>

<style lang="scss" scoped>

    .grid-view {
        @include flex(column);
        flex-grow: 1;
    }

    .list {
        flex-grow: 1;
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

    .dir,
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
        max-width: 15em;

        .bookmark {
            position: absolute;
            @include position(0.35em, 0.1em, auto, auto);
            font-size: 0.75em;
            opacity: 0;
            transform: translateY(-0.15em) rotate(10deg);
            transition: all 0.3s;
            color: $palette-deep-blue;

            &.visible {
                opacity: 1;
                transform: none;
            }
        }

        .extension {
            @include font(600, 0.85em);
            background: $palette-deep-blue;
            max-width: 5em;
            overflow: hidden;
            text-overflow: ellipsis;
            flex-shrink: 0;
            padding: 0.25em 0.45em;
            white-space: nowrap;
            text-transform: uppercase;
            border-radius: 0.15em;
            color: white;
        }

        &.selected {
            border-color: rgba($palette-cloud-blue, 0.5);
            box-shadow: 0 1px 8px 0 rgba($palette-cloud-blue, 0.15);

            .name,
            .detail {
                color: $palette-cloud-blue;
            }
        }

        &.droppable {
            border-color: rgba($palette-cloud-blue, 0.75);
            box-shadow: 0 1px 8px 0 rgba($palette-cloud-blue, 0.5);
            transform: translateY(-2px);
        }

        &.cutted {
            opacity: 0.75;
        }

        .name,
        .detail {
            color: $palette-deep-blue;
        }

        .name {
            margin: 0 0.5em;
            padding: 0.15em 0 0.15em;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
            white-space: nowrap;
            overflow: hidden;

            &[contenteditable=true] {
                border-color: $palette-deep-purple;
                cursor: text;
                outline: none;
            }

            &:focus {
                text-overflow: clip;
            }

            &:not(:focus) {
                text-overflow: ellipsis;
            }
        }
    }
</style>
