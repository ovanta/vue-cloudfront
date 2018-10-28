<template>
    <section :class="{shortcuts: 1, open: $store.state.keyboardShortcuts}">

        <div class="container">

            <div class="header">
                <span class="title">Keyboard Shortcuts</span>
                <i class="material-icons close-btn" @click="$store.commit('keyboardShortcuts', false)">close</i>
            </div>


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

    </section>
</template>


<script>

    export default {

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
                            {keys: ['ctrl', 'v'], action: 'Paste folder / files.'},
                            {keys: ['n', 'f'], action: 'Create new folder.'}
                        ]
                    },

                    {
                        name: 'General',
                        shortcuts: [
                            {keys: ['v', 'l'], action: 'Change view to list.'},
                            {keys: ['v', 'g'], action: 'Change view to grid.'},
                            {keys: ['g', 'u'], action: 'Go up in hierarchy.'},
                            {keys: ['h', 'k'], action: 'Show keyboard shortcuts.'},
                            {keys: ['esc'], action: 'Close any popup like menu or this page.'},
                            {keys: ['delete'], action: 'Deletes currently selected files / folders.'},
                            {keys: ['d', 'g'], action: 'Show debug screen.'}
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

                // Clear selection
                if (keys.KeyS && keys.Escape) {
                    store.commit('selection/clear');
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
                    this.$store.commit('keyboardShortcuts', true);
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

                // Debug screen
                if (keys.KeyD && keys.KeyB) {
                    this.$store.commit('debugScreen', 'toggle');
                }
            }
        },

        mounted() {

            // Close via escape key
            window.addEventListener('keyup', e =>
                e.key === 'Escape' && this.$store.commit('keyboardShortcuts', false)
            );

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

    .shortcuts {
        position: absolute;
        @include position(0, 0, 0, 0);
        @include flex(row, center, center);
        transform: translateY(-10px);
        visibility: hidden;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s, visibility 0.3s 0s;
        background: rgba($palette-deep-blue, 0.05);

        &.open {
            transform: none;
            visibility: visible;
            opacity: 1;
        }
    }

    .shortcuts {

        .container {
            background: white;
            box-shadow: 0 8px 25px 0 rgba(black, 0.08), 0 0 5px 0 rgba(black, 0.02);
            padding: 1.25em 2em 2em;
            border-radius: 0.15em;

            .header {
                @include flex(row);

                .title {
                    color: $palette-deep-blue;
                    font-weight: 600;
                }

                .close-btn {
                    margin-left: auto;
                    padding-bottom: 0.5em;
                    color: $palette-grayish-blue;
                    transition: all 0.3s;
                    cursor: pointer;

                    &:hover {
                        color: $palette-tomatoe-red;
                    }
                }
            }
        }

        .shortcut-section {
            @include flex(column);

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
                    margin-right: 2em;

                    .key {
                        margin-right: 0.5em;
                        color: $palette-cloud-blue;
                        border: 1px solid rgba($palette-cloud-blue, 0.75);
                        border-bottom: 2px solid rgba($palette-cloud-blue, 0.9);
                        border-radius: 2px;
                        padding: 0.1em 0.45em 0.15em 0.45em;
                    }
                }

                p {
                    font-size: 0.8em;
                    font-weight: 600;
                    color: darken($palette-grayish-blue, 15);
                }
            }
        }

    }

</style>
