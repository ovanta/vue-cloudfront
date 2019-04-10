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
                     :class="{selected: node._selected, dir: 1, cutted: node._cutted}"
                     :data-hash="node.id"
                     @touchend="select($event, node)"
                     @click.left="select($event, node)"
                     @click.right="select($event, node)">

                    <i :class="{'fas fa-fw fa-star star': 1, visible: node.marked}" :style="{color: node.color}"></i>
                    <i :style="{color: node.color}" class="fas fa-fw fa-folder"></i>

                    <span v-content-editable="node._editable"
                          v-select-all="node._editable"
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
                         :class="{selected: node._selected, file: 1, cutted: node._cutted}"
                         :data-hash="node.id"
                         @touchend="select($event, node)"
                         @click.left="select($event, node)"
                         @click.right="select($event, node)">

                        <embed-file-preview :node="node">

                            <!-- Fallback if no preview is available -->
                            <button @click="$store.dispatch('data/download', {node})">
                                Download ({{ node.size | readableByteCount }})
                            </button>
                        </embed-file-preview>

                        <div class="info">
                            <i :class="{'fas fa-fw fa-star star': 1, visible: node.marked}" :style="{color: node.color}"></i>
                            <span v-if="node.extension" class="extension">{{ node.extension }}</span>

                            <span v-content-editable="node._editable"
                                  v-select-all="node._editable"
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

    // Selectable plugin
    import Selectable from '../plugins/selectable';

    // File preview
    import EmbedFilePreview from '../../overlay/filepreview/EmbedFilePreview';

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
                fileLimit: 0,
                dirLimit: this.$config.visibleNodesChunkSize
            };
        },

        computed: {
            ...shared.computed
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
        overflow-y: auto;
        padding: 0 0.25em 2.5em;
    }

    h1 {
        position: relative;
        display: inline-block;
        font-size: 0.85em;
        color: $palette-asphalt;
        padding: 0.15em 0 0.5em;
        border-radius: 0.15em;
        margin: 1.75em 0 0.35em;
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
        margin: 0 0.5em 0.5em 0;
        cursor: pointer;
        border: 1px solid transparent;
        max-width: 15em;

        > i {
            font-size: 1.25em;
        }
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

            &:not(.empty) {
                margin-bottom: 1em;
            }

            &::before {
                @include pseudo();
                @include position(auto, 0, -0.25em, 0);
                background: linear-gradient(to bottom, transparent, white 50%);
                height: 5%;
            }

            &.empty {
                margin: 0.5em 0;

                > i {
                    @include font(600, 0.9em);
                    width: 100%;
                    text-align: center;
                    color: $palette-asphalt;
                    margin-top: 0.75em;
                }

                > button {
                    @include font(600, 0.95em);
                    margin: 0 auto;
                    background: $palette-asphalt;
                    color: $palette-snow-white;
                    transition: all 0.3s;
                    padding: 0.4em 0.8em;
                    border-radius: 0.15em;
                    width: 100%;

                    &:hover {
                        background: lighten($palette-asphalt, 5);
                    }
                }
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
        border-radius: 0.2em;
        font-size: 0.8em;
        box-shadow: 0 1px 3px 0 rgba(black, 0.1);
        background: white;
        border: 1px solid transparent;
        padding: 0.5em 0.9em;

        .star {
            position: absolute;
            @include position(-0.4em, -0.5em, auto, auto);
            font-size: 0.85em;
            opacity: 0;
            transform: translateY(-0.15em) rotate(10deg);
            transition: all 0.3s;
            color: $palette-asphalt;

            &.visible {
                opacity: 1;
                transform: none;
            }
        }

        .extension {
            @include font(600, 0.85em);
            @include white-space-overflow;
            background: $palette-asphalt;
            max-width: 5em;
            flex-shrink: 0;
            padding: 0.25em 0.45em;
            text-transform: uppercase;
            border-radius: 0.15em;
            color: white;
        }

        &.selected,
        &.droppable {
            border-color: rgba($palette-cloud-blue, 0.75);
            box-shadow: 0 1px 3px 0 rgba($palette-cloud-blue, 0.5),
            0 0 0 1px rgba($palette-cloud-blue, 0.75);

            &.droppable {
                box-shadow: 0 1px 8px 0 rgba($palette-cloud-blue, 0.5),
                0 0 0 1px rgba($palette-cloud-blue, 0.75);

                transform: translateY(-2px);
                transition: all 0.3s;
            }
        }

        &.cutted {
            opacity: 0.75;
        }

        .name,
        .detail {
            color: $palette-asphalt;
        }

        .name {
            margin: 0 0.5em;
            padding: 0.15em 0 0.15em;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;
            white-space: nowrap;
            overflow: hidden;
            width: 100%;

            &[contenteditable=true] {
                border-color: $palette-theme-primary;
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
