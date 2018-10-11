<template>
    <section>

        <!-- Navigation bar with hierarchy -->
        <div class="nav">
            <hierarchy></hierarchy>

            <i class="material-icons" v-show="viewType === 'grid'">widgets</i>
            <i class="material-icons" v-show="viewType === 'list'">view_list</i>
        </div>

        <!-- Folder / file -views -->
        <list-view class="view" v-show="viewType === 'list'"></list-view>


    </section>
</template>

<script>

    // Components
    import Hierarchy from './Hierarchy';
    import ListView from './ListView';

    export default {

        components: {
            Hierarchy,
            ListView
        },

        data() {
            return {
                viewType: 'list',
            }
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
        }
    }

    .view {
        margin-top: 0.5em;
    }

</style>
