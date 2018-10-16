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

    // Libraries
    // TODO: Publish new release with fixed bugfixes
    import Selection from '../../../../../selection/dist/selection.min';

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
                selection: null
            };
        },

        methods: {

            openMenu(evt) {

                // Get selection or use a empty array as fallback value.
                const nodes = (this.selection && this.selection.getSelection()) || [];

                // Resolve nodes
                const storeNodes = this.$store.state.nodes;
                const resolvedNodes = [];

                for (const node of nodes) {
                    const hash = node.getAttribute('data-hash');

                    // Check if hash is present
                    if (hash) {
                        const resolved = storeNodes.find(v => v.hash === hash);

                        // Check if hash has been correctly resolved
                        if (resolved) {
                            resolvedNodes.push(resolved);
                        }
                    }
                }

                // Open menu, pass mousevent and resolved nodes
                this.$refs.contextMenu.$emit('show', evt, resolvedNodes);
            },

            clearSelection() {
                if (this.selection) {
                    this.selection.getSelection().forEach(element => element.classList.remove('selected'));
                    this.selection.clearSelection();
                }
            }

        },

        mounted() {

            this.$store.subscribe(mutation => {


                // Cancel selection / close menu on new location
                if (mutation.type === 'location/update') {

                    // Hide menu
                    this.$refs.contextMenu.$emit('hide');

                    // Re-mount selectionjs
                    mountSelectionjs.call(this);
                }

                // Clear selection if delete action was performed
                if (mutation.type === 'nodes/delete') {
                    this.clearSelection();
                }

            });
        }
    };

    function mountSelectionjs() {

        // Clear selection and disable instance
        if (this.selection) {
            this.clearSelection();
            this.selection.destroy();
        }

        const vueInst = this;
        this.selection = Selection.create({

            class: 'selection-area',

            boundaries: ['#app'],

            selectables: ['.selectable'],

            validateStart(evt) {

                // If left click, check if user is currently
                // hovering a selected area, if yes cancel new selection.
                // Otherwise start as default.
                if(evt.button === 2){
                    let parent = evt.target;
                    while (true) {
                        if (parent.classList.contains('selected')) {
                            return false;
                        } else if (parent.parentElement) {
                            parent = parent.parentElement;
                        } else {
                            return true;
                        }
                    }
                }

                return true;
            },

            onSelect(evt) {

                // Close context menu
                vueInst.$refs.contextMenu.$emit('hide');

                // Remove class if the user don't pressed the control key or ⌘ key and the
                // current target is already selected
                if (!evt.originalEvent.ctrlKey && !evt.originalEvent.metaKey) {

                    // Remove class from every element which is selected
                    evt.selectedElements.forEach(s => s.classList.remove('selected'));

                    // Clear previous selection
                    this.clearSelection();
                }

                // Check if clicked element is already selected
                if (evt.target.classList.contains('selected')) {

                    // Unselect element
                    evt.target.classList.remove('selected');
                    this.removeFromSelection(evt.target);
                } else {

                    // Select element
                    evt.target.classList.add('selected');
                    this.keepSelection();
                }
            },

            onStart(evt) {

                // Close context menu
                vueInst.$refs.contextMenu.$emit('hide');

                // Remove class if the user don't pressed the control key or ⌘ key
                if (!evt.originalEvent.ctrlKey && !evt.originalEvent.metaKey) {

                    // Unselect all elements
                    evt.selectedElements.forEach(s => s.classList.remove('selected'));

                    // Clear previous selection
                    this.clearSelection();
                }
            },

            onMove(evt) {

                // Add a custom class to the elements which where selected.
                evt.selectedElements.forEach(s => s.classList.add('selected'));
                evt.changedElements.removed.forEach(s => s.classList.remove('selected'));
            },

            onStop() {
                this.keepSelection();
            }
        });
    }

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

<style lang="scss">

    .selection-area {
        border: 1px solid rgba($palette-cloud-blue, 0.8);
        background: rgba($palette-cloud-blue, 0.1);
    }

</style>
