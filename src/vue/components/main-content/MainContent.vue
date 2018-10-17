<template>
    <section class="node-rep" @contextmenu.prevent="openMenu($event)">

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <i class="material-icons" v-show="viewType === 'grid'" @click="viewType = 'list'">widgets</i>
            <i class="material-icons" v-show="viewType === 'list'" @click="viewType = 'grid'">view_list</i>
        </div>

        <!-- Folder / file -views -->
        <list-view class="view" v-if="viewType === 'list'"></list-view>
        <grid-view class="view" v-if="viewType === 'grid'"></grid-view>

        <!-- Context menu -->
        <context-menu ref="contextMenu"></context-menu>

    </section>
</template>

<script>

    // Components
    import Hierarchy from './Hierarchy';
    import ListView from './ListView';
    import GridView from './GridView';
    import ContextMenu from './ContextMenu';

    export default {

        components: {
            Hierarchy,
            ListView,
            GridView,
            ContextMenu
        },

        data() {
            return {
                viewType: 'list',
                selection: null,
                storeUnsubscription: null
            };
        },

        methods: {

            openMenu(evt) {

                // Open menu, pass mousevent and resolved nodes
                this.$refs.contextMenu.$emit('show', evt);
            },

            keyboardEvent(evt) {

                // Check for cut event
                const selectedNodes = this.$store.state.selection;
                const nodes = this.$store.state.nodes;
                if (selectedNodes.length && evt.code === 'KeyX' && evt.ctrlKey) {

                    // Apply state
                    nodes.forEach(n => n.cutted = false);
                    selectedNodes.forEach(n => n.cutted = true);

                    // Save to clipboard
                    this.$store.commit('clipboard/insert', {
                        nodes: selectedNodes,
                        type: 'cut'
                    });

                    return;
                }

                // Check for paste event
                const clipboardNodes = this.$store.state.clipboard.nodes;
                const locHash = this.$store.getters['location/currentLocation'];
                if (clipboardNodes.length && evt.code === 'KeyV' && evt.ctrlKey) {

                    clipboardNodes.forEach(n => n.cutted = false);

                    // Move elements
                    this.$store.commit('nodes/move', {nodes: clipboardNodes, destination: locHash});

                    // Clear clipboard
                    this.$store.commit('clipboard/clear');
                }
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


            // Listen for keyboard events
            window.addEventListener('keyup', this.keyboardEvent);
        },

        destroyed() {

            // Unsubscribe from store if existing
            if (this.storeUnsubscription) {
                this.storeUnsubscription();
            }

            // Unbind keyevent listener
            window.removeEventListener('keyup', this.keyboardEvent);
        }
    };

</script>


<style lang="scss" scoped>

    .node-rep {
        flex-grow: 1;
    }

    .nav {
        @include flex(row);

        i {
            color: $palette-grayish-blue;
            margin-left: auto;
            cursor: pointer;
            @include animate('1s ease forwards') {
                from {
                    opacity: 0;
                }
                to {
                    opacity: 1;
                }
            }
        }
    }

    .view {
        margin-top: 0.5em;
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
