<template>
    <section class="grid-view">

        <div ref="list"
             class="list"
             @scroll="scroll">

            <!-- Folders -->
            <h1 v-if="nodes.dir.length">Folders</h1>
            <div class="grid-container small">
                <div v-double-tap="() => updateLocation(node)"
                     v-for="node of croppedNodes.dir"
                     :key="node.id"
                     :class="{selected: selection.includes(node), dir: 1, cutted: cutted.includes(node)}"
                     :data-hash="node.id">

                    <svg :style="{fill: node.color}"
                         xmlns="http://www.w3.org/2000/svg"
                         viewBox="0 0 64 64">
                        <path
                            d="M 5 10 C 3.300781 10 2 11.300781 2 13 L 2 52 C 2 54.199219 3.800781 56 6 56 L 60 56 C 62.199219 56 64 54.199219 64 52 L 64 23 C 64 21.300781 62.699219 20 61 20 L 58 20 L 58 19 C 58 17.300781 56.699219 16 55 16 L 29.699219 16 C 28.898438 16 28.199219 15.699219 27.597656 15.097656 L 23.902344 11.402344 C 23 10.5 21.699219 10 20.402344 10 Z M 5 12 L 20.402344 12 C 21.199219 12 21.898438 12.300781 22.5 12.902344 L 26.199219 16.597656 C 27.097656 17.5 28.398438 18 29.699219 18 L 55 18 C 55.601563 18 56 18.398438 56 19 L 56 52 C 56 52.601563 56.199219 53.300781 56.597656 54 L 6 54 C 4.898438 54 4 53.101563 4 52 L 4 46 L 45 46 C 45.601563 46 46 45.601563 46 45 C 46 44.398438 45.601563 44 45 44 L 4 44 L 4 13 C 4 12.398438 4.398438 12 5 12 Z M 58 22 L 61 22 C 61.601563 22 62 22.398438 62 23 L 62 52 C 62 53.101563 61.101563 54 60 54 C 58.800781 54 58 52.601563 58 52 Z M 11 24 C 10.398438 24 10 24.398438 10 25 C 10 25.601563 10.398438 26 11 26 L 21 26 C 21.601563 26 22 25.601563 22 25 C 22 24.398438 21.601563 24 21 24 Z M 25 24 C 24.398438 24 24 24.398438 24 25 C 24 25.601563 24.398438 26 25 26 L 31 26 C 31.601563 26 32 25.601563 32 25 C 32 24.398438 31.601563 24 31 24 Z M 11 28 C 10.398438 28 10 28.398438 10 29 C 10 29.601563 10.398438 30 11 30 L 15 30 C 15.601563 30 16 29.601563 16 29 C 16 28.398438 15.601563 28 15 28 Z M 19 28 C 18.398438 28 18 28.398438 18 29 C 18 29.601563 18.398438 30 19 30 L 26 30 C 26.601563 30 27 29.601563 27 29 C 27 28.398438 26.601563 28 26 28 Z M 49 44 C 48.398438 44 48 44.398438 48 45 C 48 45.601563 48.398438 46 49 46 L 53 46 C 53.601563 46 54 45.601563 54 45 C 54 44.398438 53.601563 44 53 44 Z M 7 48 C 6.398438 48 6 48.398438 6 49 L 6 51 C 6 51.601563 6.398438 52 7 52 C 7.601563 52 8 51.601563 8 51 L 8 49 C 8 48.398438 7.601563 48 7 48 Z M 12 48 C 11.398438 48 11 48.398438 11 49 L 11 51 C 11 51.601563 11.398438 52 12 52 C 12.601563 52 13 51.601563 13 51 L 13 49 C 13 48.398438 12.601563 48 12 48 Z M 17 48 C 16.398438 48 16 48.398438 16 49 L 16 51 C 16 51.601563 16.398438 52 17 52 C 17.601563 52 18 51.601563 18 51 L 18 49 C 18 48.398438 17.601563 48 17 48 Z M 22 48 C 21.398438 48 21 48.398438 21 49 L 21 51 C 21 51.601563 21.398438 52 22 52 C 22.601563 52 23 51.601563 23 51 L 23 49 C 23 48.398438 22.601563 48 22 48 Z M 27 48 C 26.398438 48 26 48.398438 26 49 L 26 51 C 26 51.601563 26.398438 52 27 52 C 27.601563 52 28 51.601563 28 51 L 28 49 C 28 48.398438 27.601563 48 27 48 Z M 32 48 C 31.398438 48 31 48.398438 31 49 L 31 51 C 31 51.601563 31.398438 52 32 52 C 32.601563 52 33 51.601563 33 51 L 33 49 C 33 48.398438 32.601563 48 32 48 Z M 37 48 C 36.398438 48 36 48.398438 36 49 L 36 51 C 36 51.601563 36.398438 52 37 52 C 37.601563 52 38 51.601563 38 51 L 38 49 C 38 48.398438 37.601563 48 37 48 Z M 42 48 C 41.398438 48 41 48.398438 41 49 L 41 51 C 41 51.601563 41.398438 52 42 52 C 42.601563 52 43 51.601563 43 51 L 43 49 C 43 48.398438 42.601563 48 42 48 Z M 47 48 C 46.398438 48 46 48.398438 46 49 L 46 51 C 46 51.601563 46.398438 52 47 52 C 47.601563 52 48 51.601563 48 51 L 48 49 C 48 48.398438 47.601563 48 47 48 Z M 52 48 C 51.398438 48 51 48.398438 51 49 L 51 51 C 51 51.601563 51.398438 52 52 52 C 52.601563 52 53 51.601563 53 51 L 53 49 C 53 48.398438 52.601563 48 52 48 Z "></path>
                    </svg>

                    <i :class="{'fas fa-fw fa-star star': 1, visible: node.marked}" :style="{color: node.color}"></i>

                    <span v-content-editable="node === editable.node"
                          v-select-all="node === editable.node"
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
                     :key="node.id"
                     :class="{file: 1, selected: selection.includes(node), cutted: cutted.includes(node)}"
                     :data-hash="node.id">

                    <i :class="{'fas fa-fw fa-star star': 1, visible: node.marked}" :style="{color: node.color}"></i>

                    <file-type-preview :node="node"/>

                    <div class="info">
                        <span v-if="node.extension" class="extension">{{ node.extension }}</span>

                        <span v-content-editable="node === editable.node"
                              v-select-all="node === editable.node"
                              class="name"
                              spellcheck="false"
                              @keydown.enter.prevent="renameNode($event, node)">{{ node.name }}</span>
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
    import FileTypePreview from './FileTypePreview';

    import shared from './shared';

    export default {
        components: {FileTypePreview},

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

<style>

    .draggable-ghost {
        width: 15em;
    }

</style>

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
        color: RGB(var(--primary-text-color));
        padding: 0.15em 0 0.5em;
        border-radius: 0.15em;
        margin: 1.75em 0 0.35em;
    }

    .grid-container {
        display: grid;
        grid-gap: 1em;
        grid-template-columns: repeat(auto-fill, minmax(13em, 1fr));

        &.small {
            grid-template-columns: repeat(auto-fill, minmax(8.5em, 1fr));
        }
    }

    .dir {
        > svg {
            @include size(3.5em);
            margin: 1.5em auto;
        }

        .name {
            display: inline-block;
            text-align: center;
        }
    }

    .dir,
    .file {
        @include flex(column);
        position: relative;
        border-radius: 0.2em;
        font-size: 0.8em;
        box-shadow: var(--shadow-mini);
        background: RGB(var(--primary-background-color));
        border: 1px solid transparent;
        padding: 0.5em 0.9em;
        cursor: pointer;

        .info {
            @include flex(row, center, flex-start);
            padding: 0.25em 0;
            overflow: hidden;
            margin-top: auto;
        }

        .star {
            @include position(0.35em, 0.35em, auto, auto);
            position: absolute;
            font-size: 0.95em;
            opacity: 0;
            transform: translateY(-0.15em);
            transition: all 0.3s;
            color: RGB(var(--primary-text-color));

            &.visible {
                opacity: 1;
                transform: none;
            }
        }

        .extension {
            @include font(600, 0.85em);
            @include white-space-overflow;
            background: RGB(var(--primary-text-color));
            color: RGB(var(--primary-background-color));
            max-width: 5em;
            flex-shrink: 0;
            padding: 0.25em 0.45em;
            text-transform: uppercase;
            border-radius: 0.15em;
        }

        &.selected,
        &.droppable {
            border-color: RGBA(var(--focus-color), 0.75);
            box-shadow: var(--shadow-droppable-node-grid-item);

            &.droppable {
                box-shadow: 0 1px 8px 0 RGBA(var(--focus-color), 0.5),
                0 0 0 1px RGBA(var(--focus-color), 0.75);
                transform: translateY(-2px);
                transition: all 0.3s;
            }
        }

        &.cutted {
            opacity: 0.75;
        }

        .name,
        .detail {
            color: RGB(var(--primary-text-color));
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
                border-color: RGB(var(--theme-primary));
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
