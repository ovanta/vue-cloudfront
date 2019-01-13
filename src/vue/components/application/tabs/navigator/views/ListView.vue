<template>
    <section class="list-view">

        <!-- Table header -->
        <div v-if="nodes.dir.length || nodes.file.length" class="header">
            <i class="fas fa-fw" style="opacity: 0">folder</i>

            <div class="name" @click="sort('name')">
                <span>Name</span>
                <i :class="`sort fas fa-fw fa-caret-${sortProps.name ? 'down' : 'up'}`"></i>
            </div>

            <div class="detail" @click="sort('lastModified')">
                <span>Last modified</span>
                <i :class="`sort fas fa-fw fa-caret-${sortProps.lastModified ? 'down' : 'up'}`"></i>
            </div>

            <div class="detail" @click="sort('size')">
                <span>Size</span>
                <i :class="`sort fas fa-fw fa-caret-${sortProps.size ? 'down' : 'up'}`"></i>
            </div>
        </div>

        <div ref="list"
             class="list"
             @scroll="scroll">

            <!-- Folders -->
            <div v-double-tap="() => updateLocation(node)"
                 v-for="node of croppedNodes.dir"
                 :class="{selected: node.selected, dir: 1, cutted: node.cutted}"
                 :data-hash="node.id"
                 @touchend="select($event, node)"
                 @click.left="select($event, node)"
                 @click.right="select($event, node)">

                <i :style="{color: node.color}" class="fas fa-fw fa-folder"></i>

                <div class="name" spellcheck="false">

                    <span v-content-editable="node.editable"
                          v-select-all="node.editable"
                          @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>

                    <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                </div>

                <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
                <span class="detail">{{ node.size | readableByteCount }}</span>
            </div>

            <!-- Files -->
            <div v-double-tap="() => $store.commit('filepreview/show', {nodes: nodes.file, index})"
                 v-for="(node, index) of croppedNodes.file"
                 :class="{selected: node.selected, file: 1, cutted: node.cutted}"
                 :data-hash="node.id"
                 @touchend="select($event, node)"
                 @click.left="select($event, node)"
                 @click.right="select($event, node)">

                <i class="fas fa-fw fa-file"></i>
                <div class="name" spellcheck="false">

                    <span v-content-editable="node.editable"
                          v-select-all="node.editable"
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

    // Config stuff
    import {visibleNodesLimit} from '../../../../../../../config/config';

    // Selectable plugin
    import Selectable from '../plugins/selectable';

    import shared from './shared';

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
                dirLimit: visibleNodesLimit,

                sortProp: null,
                sortProps: {
                    name: false,
                    lastModified: false,
                    size: false
                }
            };
        },

        computed: {
            ...shared.computed,

            croppedNodes() {
                const {fileLimit, dirLimit} = this;
                const nodes = {
                    file: this.nodes.file.slice(0, fileLimit),
                    dir: this.nodes.dir.slice(0, dirLimit)
                };

                const {sortProp} = this;
                if (sortProp) {

                    /**
                     * Values which are used to toggle
                     * each sorting type individually.
                     */
                    const ra = this.sortProps[sortProp] ? -1 : 1;
                    const rb = ra * -1;

                    // Find correct sorting function
                    const sortFn = (a, b) => a[sortProp] > b[sortProp] ? ra : rb;

                    // Sort pre-calulated nodes and re-render everything
                    nodes.file.sort(sortFn);
                    nodes.dir.sort(sortFn);
                }

                return nodes;
            }
        },

        watch: {
            ...shared.watch
        },

        mounted() {
            this.riseVisibleArea();
        },

        updated() {
            Selectable.resolveSelectables();
        },

        methods: {
            ...shared.methods,

            sort(type) {

                // Toggle sort-direction to descending / ascending
                this.sortProps[type] = !this.sortProps[type];
                this.sortProp = type;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .list-view {
        @include flex(column);
        flex-grow: 1;
    }

    .list {
        height: 0;
        flex-grow: 1;
        overflow: auto;
        padding-bottom: 2.5em;
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
