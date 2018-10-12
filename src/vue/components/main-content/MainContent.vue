<template>
    <section>

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
                viewType: 'list'
            };
        }
    };
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
