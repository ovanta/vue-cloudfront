<template>
    <section class="navigator" @contextmenu.prevent="openMenu($event)">

        <search-bar></search-bar>

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <div class="controls">

                <!-- Node-views, grid and list -->
                <i class="fas fa-fw fa-th-list" v-show="$store.state.viewType === 'grid'" @click="setViewType('list')"></i>
                <i class="fas fa-fw fa-th" v-show="$store.state.viewType === 'list'" @click="setViewType('grid')"></i>

                <!-- Show keyboard-shortcuts button -->
                <i class="fas fa-fw fa-keyboard" @click="$store.commit('setActivePopup', 'KeyboardShortcuts')"></i>

                <!-- Introduction -->
                <intro-box text="Disable / enable grid or try out our keyboard shortcuts." header="Search Options"></intro-box>
            </div>
        </div>

        <!-- Folder / file -views -->
        <!-- TODO: Draggable nodes? -->
        <list-view class="view" v-if="$store.state.viewType === 'list'"></list-view>
        <grid-view class="view" v-if="$store.state.viewType === 'grid'"></grid-view>

        <!-- Context menu -->
        <context-menu ref="contextMenu"></context-menu>

    </section>
</template>

<script>

    // Plugins
    import SelectionPlugin from './plugins/selectable';
    import DraggablePlugin from './plugins/draggables';

    // Components
    import Hierarchy from './Hierarchy';
    import ListView from './views/ListView';
    import GridView from './views/GridView';
    import ContextMenu from './ContextMenu';
    import SearchBar from './SearchBar';

    export default {

        components: {
            Hierarchy,
            ListView,
            GridView,
            ContextMenu,
            SearchBar
        },

        data() {
            return {
                selection: null,
                draggablePlugin: null,
                selectionPlugin: null
            };
        },

        methods: {

            openMenu(evt) {
                this.$refs.contextMenu.$emit('show', evt);
            },

            setViewType(type) {
                this.$store.commit('setViewType', type);
            }

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

</style>
