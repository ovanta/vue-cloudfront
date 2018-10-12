<template>
    <section class="node-rep">

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <i class="material-icons" v-show="viewType === 'grid'" @click="viewType = 'list'">widgets</i>
            <i class="material-icons" v-show="viewType === 'list'" @click="viewType = 'grid'">view_list</i>
        </div>

        <!-- Folder / file -views -->
        <list-view class="view" v-show="viewType === 'list'"></list-view>
        <grid-view class="view" v-show="viewType === 'grid'"></grid-view>


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

    export default {

        components: {
            Hierarchy,
            ListView,
            GridView
        },

        data() {
            return {
                viewType: 'list',
                selection: null
            };
        },

        updated() {
            mountSelectionJs(this);
        },

        mounted() {
            mountSelectionJs(this);
        }
    };

    function mountSelectionJs(vueinst) {

        if (vueinst.selection) {
            vueinst.selection.disable();
        }

        vueinst.selection = Selection.create({

            class: 'selection-area',

            boundaries: ['#app'],

            selectables: ['.selectable'],

            onSelect(evt) {

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
