<template>
    <section class="navigator" @contextmenu.prevent="openMenu($event)">

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <div class="controls">
                <!-- Node-views, grid and list -->
                <i class="material-icons" v-show="$store.state.viewType === 'grid'" @click="setViewType('list')">grid_on</i>
                <i class="material-icons" v-show="$store.state.viewType === 'list'" @click="setViewType('grid')">grid_off</i>

                <!-- Show keyboard-shortcuts button -->
                <i class="material-icons" @click="$store.commit('keyboardShortcuts', true)">keyboard</i>

                <!-- Introduction -->
                <intro-box text="Disable / enable grid or try out our keyboard shortcuts." header="Search Options"></intro-box>
            </div>
        </div>

        <!-- Folder / file -views -->
        <list-view class="view" v-if="$store.state.viewType === 'list'"></list-view>
        <grid-view class="view" v-if="$store.state.viewType === 'grid'"></grid-view>

        <!-- Context menu -->
        <context-menu ref="contextMenu"></context-menu>

    </section>
</template>

<script>

    // Modules
    import Selection from '@simonwep/selection-js';

    // Components
    import Hierarchy from './Hierarchy';
    import ListView from './views/ListView';
    import GridView from './views/GridView';
    import ContextMenu from './ContextMenu';
    import IntroBox from '../../ui/IntroBox';

    export default {

        components: {
            Hierarchy,
            ListView,
            GridView,
            ContextMenu,
            IntroBox
        },

        data() {
            return {
                selection: null,

                selectionInstance: null,
                storeUnsubscription: null
            };
        },

        methods: {

            openMenu(evt) {

                // Open menu, pass mousevent and resolved nodes
                this.$refs.contextMenu.$emit('show', evt);
            },

            setViewType(type) {
                this.$store.commit('setViewType', type);
            }

        },

        mounted() {

            this.storeUnsubscription = this.$store.subscribe(mutation => {

                // Cancel selection / close menu on new location
                if (mutation.type === 'location/update') {

                    // Hide menu
                    this.$refs.contextMenu.$emit('hide');

                    // Clear selection
                    this.$store.commit('selection/clear');
                }

                // Clear selection if delete action was performed
                if (mutation.type === 'nodes/delete') {
                    this.$store.commit('selection/clear');
                }
            });

            // Create selection instance
            const vueInst = this;
            this.selection = new Selection({

                class: 'selection-area',

                singleClick: false, // Single click is handled by GridView and ListView

                startThreshold: 2,

                selectables: ['.file', '.folder'],
                startareas: ['.list'],
                boundaries: ['.list'],

                onStart(evt) {

                    // Every non-ctrlKey causes a selection reset
                    if (!evt.originalEvent.ctrlKey) {
                        vueInst.$store.commit('selection/clear');
                    }
                },

                onMove(evt) {
                    const {changedElements} = evt;

                    /**
                     * Only add / remove selected class to increase selection performance.
                     */
                    changedElements.added.forEach(v => v.classList.add('selected'));
                    changedElements.removed.forEach(v => v.classList.remove('selected'));
                },

                onStop(evt) {
                    const {selectedElements} = evt;

                    // Remove selected class, this is getting handled by vue
                    selectedElements.forEach(v => v.classList.remove('selected'));

                    /**
                     * Every element has a data-hash property wich is used
                     * to find the selected nodes. Find these and append they
                     * to the current selection.
                     */
                    const selectedHashes = selectedElements.map(v => v.getAttribute('data-hash'));
                    const selectedNodes = vueInst.$store.state.nodes.filter(v => selectedHashes.includes(v.hash));
                    vueInst.$store.commit('selection/append', selectedNodes);
                }
            });
        },

        destroyed() {

            // Unsubscribe from store if existing
            if (this.storeUnsubscription) {
                this.storeUnsubscription();
            }

            // Destory selection instance
            if (this.selection) {
                this.selection.destroy();
            }
        }
    };

</script>


<style lang="scss" scoped>

    .navigator {
        @include flex(column);
        flex-grow: 1;
        padding: 2em 2em 0 2em;
        background: mix($palette-snow-white, white, 75);
    }

    .nav {
        @include flex(row);
        flex-shrink: 0;
        border-bottom: 2px solid rgba($palette-deep-blue, 0.03);
        padding-bottom: 1em;

        .controls {
            position: relative;
            margin-left: auto;

            i {
                color: rgba($palette-grayish-blue, 0.75);
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
