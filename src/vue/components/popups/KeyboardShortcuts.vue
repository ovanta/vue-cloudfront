<template>
    <popup store-prop="KeyboardShortcuts" title="Keyboard Shortcuts">
        <div class="shortcut-sections">
            <section class="shortcut-section" v-for="sec of sections">

                <h2>{{ sec.name }}</h2>

                <div class="shortcut" v-for="shortcut of sec.shortcuts">
                    <div class="keys">
                        <span class="key" v-for="key of shortcut.keys">{{ key }}</span>
                    </div>

                    <p>{{ shortcut.action }}</p>
                </div>
            </section>
        </div>
    </popup>
</template>

<script>

    // Import component
    import Popup from './Popup';

    export default {

        components: {Popup},

        data() {
            return {
                sections: [

                    {
                        name: 'Selecting',
                        shortcuts: [
                            {keys: ['ctrl', 'shift'], action: 'Select everything up to current element.'},
                            {keys: ['ctrl', 'a'], action: 'Select everything.'},
                            {keys: ['s', 'esc'], action: 'Clear selection.'},
                            {keys: ['s', 'd'], action: 'Select directories.'},
                            {keys: ['s', 'f'], action: 'Select files.'},
                            {keys: ['s', 'i'], action: 'Invert selection.'}
                        ]
                    },

                    {
                        name: 'Actions',
                        shortcuts: [
                            {keys: ['ctrl', 'x'], action: 'Cut folder / files.'},
                            {keys: ['ctrl', 'c'], action: 'Copy folder / files.'},
                            {keys: ['ctrl', 'v'], action: 'Paste folder / files.'},
                            {keys: ['n', 'f'], action: 'Create new folder.'},
                            {keys: ['m', 'a'], action: 'Add star to selected files / folders.'},
                            {keys: ['m', 'r'], action: 'Remove star from selected files / folders.'},
                            {keys: ['delete'], action: 'Deletes currently selected files / folders.'}
                        ]
                    },

                    {
                        name: 'General',
                        shortcuts: [
                            {keys: ['v', 'l'], action: 'Change view to list.'},
                            {keys: ['v', 'g'], action: 'Change view to grid.'},
                            {keys: ['j', 'm'], action: 'Show / hide marked folders / files.'},
                            {keys: ['g', 'u'], action: 'Go up in hierarchy.'},
                            {keys: ['d', 'b'], action: 'Show debug screen.'},
                            {keys: ['esc'], action: 'Close any popup like menu or this page.'}
                        ]
                    },

                    {
                        name: 'Help',
                        shortcuts: [
                            {keys: ['h', 'k'], action: 'Show keyboard shortcuts.'},
                            {keys: ['h', 'f'], action: 'Show search filters.'}
                        ]
                    }
                ],

                detectKeyCombinationsUnsubscription: null
            };
        },

        methods: {


            keyboardEvent(keys, event) {
                const store = this.$store;
                const state = store.state;

                const selectedNodes = state.selection;
                const clipboardNodes = state.clipboard.nodes;
                const locHash = store.getters['location/currentLocation'];

                // Cut nodes
                if (selectedNodes.length && keys.KeyX && keys.ctrlKey) {

                    // Save to clipboard
                    store.commit('clipboard/clear');
                    store.commit('clipboard/insert', {
                        nodes: selectedNodes,
                        type: 'move'
                    });

                    return;
                }

                // Copy nodes
                if (selectedNodes.length && keys.KeyC && keys.ctrlKey) {

                    // Save to clipboard
                    store.commit('clipboard/clear');
                    store.commit('clipboard/insert', {
                        nodes: selectedNodes,
                        type: 'copy'
                    });

                    return;
                }

                // Paste nodes
                if (clipboardNodes.length && keys.KeyV && keys.ctrlKey) {

                    // Move elements
                    store.commit(`nodes/${state.clipboard.type}`, {
                        nodes: clipboardNodes,
                        destination: locHash
                    });

                    // Clear clipboard
                    store.commit('clipboard/clear');
                    return;
                }

                // Hierarchy up event
                if (keys.KeyG && keys.KeyU) {
                    store.dispatch('location/goUp');
                    return;
                }

                // Change views
                if (keys.KeyV && keys.KeyG) {
                    store.commit('setViewType', 'grid');
                    return;
                }

                if (keys.KeyV && keys.KeyL) {
                    store.commit('setViewType', 'list');
                    return;
                }

                // Define nodes as function to prevent
                // useless calculations. Returns, if there is, the search result
                // or all nodes which are currently into view.
                const nodes = () => state.search.active ? state.search.nodes : store.getters['nodes/currentDisplayedNodes']();

                // Select everything
                if (keys.ctrlKey && keys.KeyA) {

                    // Select all nodes which are currently under the current location
                    const nodesMap = nodes();
                    store.commit('selection/append', nodesMap.file.concat(nodesMap.folder));
                    return;
                }

                // Select all folders
                if (keys.KeyS && keys.KeyD) {

                    // Clear selection to remove previously selected files
                    store.commit('selection/clear');

                    // Select all folders which are currently under the current location
                    store.commit('selection/append', nodes().folder);
                    return;
                }

                // Select all files
                if (keys.KeyS && keys.KeyF) {

                    // Clear selection to remove previously selected folders
                    store.commit('selection/clear');

                    // Select all files which are currently under the current location
                    store.commit('selection/append', nodes().file);
                    return;
                }

                // Clear selection
                if (keys.KeyS && keys.Escape) {
                    store.commit('selection/clear');
                    return;
                }

                // Inverse selection all files
                if (keys.KeyS && keys.KeyI) {
                    const nodesMap = nodes();
                    const notSelected = nodesMap.file.concat(nodesMap.folder).filter(v => !selectedNodes.includes(v));

                    // Clear selection
                    store.commit('selection/clear');

                    // Append previously not
                    store.commit('selection/append', notSelected);
                    return;
                }

                // Add star
                if (keys.KeyM && keys.KeyA) {
                    this.$store.commit('nodes/addStar', selectedNodes);
                    return;
                }

                // Remove star
                if (keys.KeyM && keys.KeyR) {
                    this.$store.commit('nodes/removeStar', selectedNodes);
                    return;
                }

                // Delete nodes
                if (keys.Delete && selectedNodes.length) {
                    store.commit('nodes/delete', selectedNodes);
                    return;
                }

                // Show keyboard shortcuts
                if (keys.KeyH && keys.KeyK) {
                    this.$store.commit('setActivePopup', 'KeyboardShortcuts');
                    return;
                }

                // Show search filters
                if (keys.KeyH && keys.KeyF) {
                    this.$store.commit('setActivePopup', 'SearchFilters');
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
                    return;
                }

                // Debug screen
                if (keys.KeyD && keys.KeyB) {
                    this.$store.commit('showDebugScreen', 'toggle');
                    return;
                }

                // Show starred files / folders
                if (keys.KeyJ && keys.KeyM) {
                    this.$store.commit('showStarredNodes', 'toggle');
                }
            }
        },

        mounted() {
            this.detectKeyCombinationsUnsubscription = this.detectKeyCombinations(window, this.keyboardEvent, e => e.target === document.body);
        },

        destroyed() {

            // Unbind detectKeyCombinationsListener
            if (this.detectKeyCombinationsUnsubscription) {
                this.detectKeyCombinationsUnsubscription();
            }
        }
    };

</script>

<style lang="scss" scoped>

    .shortcut-sections {
        @include flex(row, flex-start, space-between);
        flex-wrap: wrap;
    }

    .shortcut-section {
        @include flex(column);
        width: 48%;

        h2 {
            @include font(400, 0.9em);
            padding: 0.75em 0 0.25em;
            border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
            margin-bottom: 0.5em;
        }

        .shortcut {
            @include flex(row, center);
            padding-bottom: 0.5em;

            .keys {
                flex-grow: 1;
                font-family: monospace;
                font-weight: 600;

                .key {
                    margin-right: 0.5em;
                    color: $palette-deep-purple;
                    border: 1px solid rgba($palette-deep-purple, 0.75);
                    border-bottom: 2px solid rgba($palette-deep-purple, 0.9);
                    border-radius: 2px;
                    padding: 0.1em 0.45em 0.15em 0.45em;
                }
            }

            p {
                @include font(600, 0.8em);
                color: darken($palette-grayish-blue, 15);
                text-align: right;
            }
        }
    }

</style>
