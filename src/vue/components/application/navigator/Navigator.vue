<template>
    <section class="navigator" @contextmenu.prevent="openMenu($event)">

        <search-bar></search-bar>

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <div class="controls">

                <!-- Node-views, grid and list -->
                <i v-tooltip="'Switch to list view'"
                   v-show="viewType === 'grid'"
                   class="fas fa-fw fa-th-list"
                   @click="setViewType('list')"></i>
                <i v-tooltip="'Switch to grid view'"
                   v-show="viewType === 'list'"
                   class="fas fa-fw fa-th"
                   @click="setViewType('grid')"></i>

                <!-- Show keyboard-shortcuts button -->
                <i class="fas fa-fw fa-keyboard" @click="$store.commit('setActivePopup', 'KeyboardShortcuts')"></i>

                <!-- Introduction -->
                <intro-box id="2"
                           header="Search Options"
                           text="Disable / enable grid or try out our keyboard shortcuts."></intro-box>
            </div>
        </div>

        <div class="views">

            <!-- Folder / file -views -->
            <list-view v-if="viewType === 'list'"
                       :nodes="nodes"
                       class="view"></list-view>
            <grid-view v-if="viewType === 'grid'"
                       :nodes="nodes"
                       class="view"></grid-view>

            <!-- Placeholder if folder is empty -->
            <div v-if="!nodes.file.length && !nodes.folder.length" class="placeholder">
                <i class="fas fa-cloud"></i>

                <span v-if="!search.active && activeTab === 'home'">
                    <b>Create a folder</b> or <b>drag and drop</b> to upload!
                </span>

                <span v-if="!search.active && activeTab === 'marked'">
                    Right click or use <b>m + a</b> to mark a file or directory!
                </span>

                <span v-if="search.active">
                    Nothing does match your search.
                </span>
            </div>
        </div>

        <!-- Context menu -->
        <context-menu ref="contextMenu"></context-menu>

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
    import IntroBox    from '../../../ui/IntroBox';

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
                selection: null,
                draggablePlugin: null,
                selectionPlugin: null
            };
        },

        computed: {
            nodes() {
                return this.$store.getters['nodes/currentDisplayedNodes'](this.$store.state.viewType === 'list');
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
                    }
                })
            );

            // Draggable and selection plugin
            this.selectionPlugin = SelectionPlugin(this);
            this.draggablePlugin = DraggablePlugin(this, this.selectionPlugin);
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
        border-bottom: 2px solid rgba($palette-deep-blue, 0.03);
        padding-bottom: 1em;
        margin: 2em 1.5em 0 1.5em;

        .controls {
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
                    color: $palette-deep-purple;
                }
            }
        }
    }

    .views {
        @include flex(column);
        flex-grow: 1;

        .view {
            margin: 0 2em 0 2em;
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
            flex-grow: 1;
            color: $palette-decent-blue;
            @include position(0, 0, 0, 0);
            @include flex(column, center, center);

            i {
                font-size: 2em;
            }

            span {
                @include font(400, 0.85em);
                margin-top: 0.2em;
            }
        }
    }

</style>
