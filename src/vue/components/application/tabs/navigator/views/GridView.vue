<template>
    <section class="grid-view">

        <div ref="list"
             class="list"
             @scroll="scroll">

            <!-- Folders -->
            <h1 v-if="nodes.dir.length">Folders</h1>
            <div class="flex-container">
                <div v-double-tap="() => updateLocation(node)"
                     v-for="node of croppedNodes.dir"
                     :class="{selected: node.selected, dir: 1, cutted: node.cutted}"
                     :data-hash="node.id"
                     @touchend="select($event, node)"
                     @click.left="select($event, node)"
                     @click.right="select($event, node)">

                    <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                    <i :style="{color: node.color}" class="fas fa-fw fa-folder"></i>

                    <span v-content-editable="node.editable"
                          v-select-all="node.editable"
                          class="name"
                          spellcheck="false"
                          @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
                </div>
            </div>

            <!-- Files -->
            <h1 v-if="nodes.file.length">Files</h1>
            <div class="grid-container">
                <div v-for="(node, index) of croppedNodes.file" class="wrapper">
                    <div v-double-tap="() => $store.commit('filepreview/show', {nodes: nodes.file, index})"
                         :class="{selected: node.selected, file: 1, cutted: node.cutted}"
                         :data-hash="node.id"
                         @touchend="select($event, node)"
                         @click.left="select($event, node)"
                         @click.right="select($event, node)">

                        <embed-file-preview :node="node">
                            <span>No preview available</span>
                        </embed-file-preview>

                        <div class="info">
                            <i :class="{'fas fa-fw fa-bookmark bookmark': 1, visible: node.marked}" :style="{color: node.color}"></i>
                            <span class="extension">{{ node.extension }}</span>

                            <span v-content-editable="node.editable"
                                  v-select-all="node.editable"
                                  class="name"
                                  spellcheck="false"
                                  @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
                        </div>
                    </div>
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

    // File preview
    import EmbedFilePreview from '../../../overlay/filepreview/EmbedFilePreview';

    import shared from './shared';

    export default {
        components: {EmbedFilePreview},

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
            ...shared.computed,

            croppedNodes() {
                const {fileLimit, dirLimit} = this;
                return {
                    file: this.nodes.file.slice(0, fileLimit),
                    dir: this.nodes.dir.slice(0, dirLimit)
                };
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
            ...shared.methods
        }
    };

</script>

<style lang="scss" scoped>

    .grid-view {
        @include flex(column);
        flex-grow: 1;
    }

    .list {
        height: 0;
        flex-grow: 1;
        overflow: auto;
        padding-bottom: 2.5em;
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

    .flex-container {
        @include flex(row, flex-start);
        flex-wrap: wrap;
    }

    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(13em, 1fr));
    }

    .dir {
        @include flex(row, center);
        margin: 0.5em 0.5em 0 0;
        transition: all 0.3s;
        cursor: pointer;
        border: 1px solid transparent;
        max-width: 15em;
    }

    .file {
        @include flex(column);
        margin: 0 1em 1em 0;
        cursor: pointer;

        .embed-file-preview {
            align-items: flex-start;
            justify-content: flex-start;
            position: relative;
            max-width: 100%;
            max-height: 12.5em;
            flex-grow: 1;
            overflow: hidden;

            > span {
                margin: 1.5em 0;
                width: 100%;
                text-align: center;
            }

            &:not(.empty) {
                margin-bottom: 1em;
            }

            &::before {
                @include pseudo();
                @include position(auto, 0, -0.25em, 0);
                background: linear-gradient(to bottom, transparent, white 50%);
                height: 5%;
            }
        }

        .info {
            @include flex(row, center, flex-start);
            padding: 0.25em 0;
            overflow: hidden;
            margin-top: auto;
        }
    }

    .dir,
    .file {
        position: relative;
        border-radius: 0.15em;
        font-size: 0.8em;
        box-shadow: 0 1px 3px 0 rgba(black, 0.05);
        background: white;
        border: 1px solid transparent;
        padding: 0.5em 0.9em;

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
            min-width: 0;

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
