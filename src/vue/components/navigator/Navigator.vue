<template>
    <section class="node-rep" @contextmenu.prevent="openMenu($event)">

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <div class="controls">
                <!-- Node-views, grid and list -->
                <i class="material-icons" v-show="viewType === 'grid'" @click="viewType = 'list'">grid_on</i>
                <i class="material-icons" v-show="viewType === 'list'" @click="viewType = 'grid'">grid_off</i>

                <!-- Show keyboard-shortcuts button -->
                <i class="material-icons" @click="$refs.keyboardShortcuts.$emit('toggle')">keyboard</i>
            </div>
        </div>

        <!-- Folder / file -views -->
        <list-view class="view" v-if="viewType === 'list'"></list-view>
        <grid-view class="view" v-if="viewType === 'grid'"></grid-view>

        <!-- Context menu -->
        <context-menu ref="contextMenu"></context-menu>

        <!-- KeyBoard-shortcuts info -->
        <key-board-shortcuts ref="keyboardShortcuts"></key-board-shortcuts>

    </section>
</template>

<script>

    // Components
    import Hierarchy from './Hierarchy';
    import ListView from './views/ListView';
    import GridView from './views/GridView';
    import ContextMenu from './ContextMenu';
    import KeyBoardShortcuts from './KeyBoardShortcuts';

    export default {

        components: {
            Hierarchy,
            ListView,
            GridView,
            ContextMenu,
            KeyBoardShortcuts
        },

        data() {
            return {
                viewType: 'grid',
                selection: null,
                storeUnsubscription: null,
                detectKeyCombinationsUnsubscription: null
            };
        },

        methods: {

            openMenu(evt) {

                // Open menu, pass mousevent and resolved nodes
                this.$refs.contextMenu.$emit('show', evt);
            },

            keyboardEvent(keys, event) {
                const store = this.$store;
                const state = store.state;

                const selectedNodes = state.selection;
                const clipboardNodes = state.clipboard.nodes;
                const locHash = store.getters['location/currentLocation'];

                // Check for cut event
                if (selectedNodes.length && keys.KeyX && keys.ctrlKey) {

                    // Save to clipboard
                    store.commit('clipboard/insert', {
                        nodes: selectedNodes,
                        type: 'cut'
                    });

                    return;
                }

                // Check for paste event
                if (clipboardNodes.length && keys.KeyV && keys.ctrlKey) {

                    // Move elements
                    store.commit('nodes/move', {
                        nodes: clipboardNodes,
                        destination: locHash
                    });

                    // Clear clipboard
                    store.commit('clipboard/clear');
                    return;
                }

                // Hierarchy up event
                if (keys.KeyG && keys.KeyU && state.location.length > 1) {
                    store.commit('location/goUp');
                    return;
                }

                // Change views
                if (keys.KeyV && keys.KeyG && this.viewType !== 'grid') {
                    this.viewType = 'grid';
                    return;
                }

                if (keys.KeyV && keys.KeyL && this.viewType !== 'list') {
                    this.viewType = 'list';
                    return;
                }

                // Define nodes as function to prevent
                // useless calculations. Returns, if there is, the search result
                // or all nodes which are currently into view.
                const nodes = () => state.search.active ? state.search.nodes : state.nodes.filter(n => n.parent === locHash);

                // Select everything
                if (keys.ctrlKey && keys.KeyA) {

                    // Select all nodes which are currently under the current location
                    store.commit('selection/append', nodes());
                    return;
                }

                // Select all folders
                if (keys.KeyS && keys.KeyD) {

                    // Clear selection to remove previously selected files
                    store.commit('selection/clear');

                    // Select all folders which are currently under the current location
                    store.commit('selection/append', nodes().filter(n => n.type === 'folder'));
                    return;
                }

                // Select all files
                if (keys.KeyS && keys.KeyF) {

                    // Clear selection to remove previously selected folders
                    store.commit('selection/clear');

                    // Select all files which are currently under the current location
                    store.commit('selection/append', nodes().filter(n => n.type === 'file'));
                    return;
                }

                // Inverse selection all files
                if (keys.KeyS && keys.KeyI) {
                    const notSelected = nodes().filter(v => !selectedNodes.includes(v));

                    // Clear selection
                    store.commit('selection/clear');

                    // Append previously not
                    store.commit('selection/append', notSelected);
                    return;
                }

                // Delete nodes
                if (keys.Delete && selectedNodes.length) {
                    store.commit('nodes/delete', selectedNodes);
                    return;
                }

                // Show keyboard shortcuts
                if (keys.KeyH && keys.KeyK) {
                    this.$refs.keyboardShortcuts.$emit('show');
                    return;
                }

                // Create new folder
                if (keys.KeyN && keys.KeyF) {

                    // Create a folder and immediatly make it editable
                    store.dispatch('nodes/createFolder', store.getters['location/currentLocation']).then(folderNode => {
                        store.commit('editable/set', folderNode);
                    });

                    // Prevent setting the letter 'f' as folder name because the freshly created
                    // folder is editable.
                    event.preventDefault();
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

            this.detectKeyCombinationsUnsubscription = this.detectKeyCombinations(window, this.keyboardEvent, e => e.target === document.body);
        },

        destroyed() {

            // Unsubscribe from store if existing
            if (this.storeUnsubscription) {
                this.storeUnsubscription();
            }

            // Unbind detectKeyCombinationsListener
            if (this.detectKeyCombinationsUnsubscription) {
                this.detectKeyCombinationsUnsubscription();
            }
        }
    };

</script>


<style lang="scss" scoped>

    .node-rep {
        @include flex(column);
        flex-grow: 1;
    }

    .nav {
        @include flex(row);
        flex-shrink: 0;
        border-bottom: 2px solid $palette-grayish-blue-transparent;
        padding-bottom: 1em;

        .controls {
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
                    color: $palette-cloud-blue;
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
