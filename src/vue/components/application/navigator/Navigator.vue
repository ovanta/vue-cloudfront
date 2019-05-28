<template>
    <section class="navigator"
             @contextmenu="openMenu">

        <search-bar/>

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy/>

            <div class="controls">

                <!-- Node-views, grid and list -->
                <i v-tooltip="'Switch to list view'"
                   v-show="viewType === 'grid'"
                   class="fas fa-fw fa-bars"
                   @click="setViewType('list')"></i>

                <i v-tooltip="'Switch to grid view'"
                   v-show="viewType === 'list'"
                   class="fas fa-fw fa-th"
                   @click="setViewType('grid')"></i>

                <!-- Show settings -->
                <i v-tooltip="'Show settings'"
                   class="settings fas fa-fw fa-cog"
                   @click="$store.commit('setActivePopup', 'Settings')"></i>

                <!-- Show keyboard-shortcuts button -->
                <i v-tooltip="'Show keyboard shortcuts'"
                   class="keyboard far fa-fw fa-keyboard"
                   @click="$store.commit('setActivePopup', 'KeyboardShortcuts')"></i>

                <!-- Introduction -->
                <intro-box id="2"
                           header="Search Options"
                           text="Disable / enable grid or try out our keyboard shortcuts."/>
            </div>
        </div>

        <div class="views">

            <!-- Folder / file -views -->
            <list-view v-if="viewType === 'list'" :nodes="nodes"/>
            <grid-view v-if="viewType === 'grid'" :nodes="nodes"/>

            <!-- Placeholder if folder is empty -->
            <div v-if="!nodes.file.length && !nodes.dir.length" class="placeholder">
                <i class="fas fa-fw fa-box-open"></i>
                <p>Nothing here...</p>
            </div>
        </div>

        <!-- Context menu -->
        <context-menu ref="contextMenu"/>

    </section>
</template>

<script>

    // Plugins
    import SelectionPlugin from './plugins/selectable';
    import DraggablePlugin from './plugins/draggables';

    // Components
    import Hierarchy   from './Hierarchy';
    import ListView    from './views/ListView';
    import GridView    from './views/GridView';
    import ContextMenu from './contextmenu/ContextMenu';
    import SearchBar   from './SearchBar';
    import IntroBox    from '../../../ui/specific/IntroBox';

    // Vue stuff
    import {mapState} from 'vuex';

    export default {

        components: {
            Hierarchy,
            ListView,
            GridView,
            ContextMenu,
            SearchBar,
            IntroBox
        },

        data() {
            return {
                keyboardSelectionIndex: -1,
                draggablePlugin: null,
                selectionPlugin: null
            };
        },

        computed: {
            nodes() {
                const calcFolderSize = this._appliedMediaQueries !== 'mobile' && this.$store.state.viewType === 'list';
                return this.$store.getters['nodes/currentDisplayedNodes'](calcFolderSize);
            },

            ...mapState(['activeTab', 'viewType', 'search'])
        },

        mounted() {

            this.$callOnDestroy(
                // Clear selection if nodes change
                this.$store.watch(store => store.nodes, () => this.$store.commit('selection/clear')),

                this.$store.subscribe(mutation => {

                    // Cancel selection / close menu on new location
                    if (mutation.type === 'location/update') {

                        // Hide menu
                        this.$refs.contextMenu.$emit('hide');

                        // Clear selection
                        this.$store.commit('selection/clear');

                        // Clear selected element index
                        this.keyboardSelectionIndex = -1;
                    }
                }),

                this.$utils.detectKeypressCombinations(
                    window,
                    this.keyboardEvent,
                    ({target}) => this.$store.state.activeTab === 'home' &&
                        target.getAttribute('contenteditable') !== 'true' &&
                        !['TEXT-AREA', 'INPUT'].includes(target.tagName)
                )
            );

            // Draggable and selection plugin
            this.selectionPlugin = SelectionPlugin;
            this.draggablePlugin = DraggablePlugin(this.selectionPlugin);
        },

        destroyed() {

            // Destory selection instance
            if (this.selectionPlugin) {
                this.selectionPlugin.destroy();
            }

            // Destory draggable instance
            if (this.draggablePlugin) {
                this.draggablePlugin.destroy();
            }
        },

        methods: {

            openMenu(evt) {
                this.$refs.contextMenu.$emit('show', evt);
            },

            setViewType(type) {
                this.$store.commit('setViewType', type);
            },

            keyboardEvent(keys) {
                const all = this.nodes.dir.concat(this.nodes.file);
                const idx = this.keyboardSelectionIndex;

                const update = () => {

                    // Clear only if user does not perform a multi-selection
                    if (!(keys.ctrlKey && keys.shiftKey)) {
                        this.$store.commit('selection/clear');
                    }

                    // Append node to current selection
                    this.$store.commit('selection/append', [all[this.keyboardSelectionIndex]]);
                };

                // Check for navigation keys
                if (keys.KeyArrowup || keys.KeyArrowleft) {
                    this.keyboardSelectionIndex = (idx - 1) < 0 ? all.length - 1 : idx - 1;
                    update();
                } else if (keys.KeyArrowdown || keys.KeyArrowright) {
                    this.keyboardSelectionIndex = (idx + 2) > all.length ? 0 : idx + 1;
                    update();
                } else if (keys.KeyEnter) {

                    // Get last node
                    const {selection} = this.$store.state;
                    if (selection.length) {
                        const lastNode = selection[selection.length - 1];

                        // If directory, open it. If file, open file-preview
                        if (lastNode.type === 'dir') {
                            this.$store.commit('location/update', lastNode);
                        } else if (lastNode.type === 'file') {
                            this.$store.commit('filepreview/show', {nodes: this.nodes.file});
                        }
                    }
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .navigator {
        @include flex(column);
        flex-grow: 1;
        max-height: 100%;
    }

    .nav {
        @include flex(row);
        flex-shrink: 0;
        border-bottom: 2px solid $palette-sick-white;
        padding-bottom: 1em;
        margin: 2em 1.5em 0 1.5em;

        .controls {
            @include flex(row, center);
            position: relative;
            margin-left: auto;
            flex-shrink: 0;

            i {
                color: $palette-decent-blue;
                cursor: pointer;
                margin-left: 0.5em;
                transition: all 0.3s;

                @include animate('1s ease forwards') {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                &:hover {
                    color: $palette-theme-primary;
                }
            }
        }
    }

    .views {
        @include flex(column);
        flex-grow: 1;

        .list-view,
        .grid-view {
            margin: 0 2em 0;
            overflow: hidden;

            @include animate('1s ease forwards') {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        }

        .placeholder {
            @include flex(column, center, center);
            width: 100%;
            flex-grow: 1000;
            padding-bottom: 10%;
            color: $palette-asphalt;

            p {
                @include font(600, 0.9em);
            }

            i {
                font-size: 2em;
                margin-bottom: 0.3em;
            }

            @include animate('0.3s ease-in-out') {
                from {
                    opacity: 0;
                    transform: translateY(-0.5em);
                }
                to {
                    opacity: 1;
                    transform: none;
                }
            }
        }
    }

    @include mq-phones {
        .nav {
            margin: 1.25em 0.75em 0.75em;

            .controls .keyboard {
                display: none;
            }
        }

        .views {
            .list-view,
            .grid-view {
                margin: 0 0.5em;
            }
        }
    }

</style>
