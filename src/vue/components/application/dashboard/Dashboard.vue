<template>
    <div class="dashboard">

        <data-statistics class="tile"/>

    </div>
</template>

<script>

    // Components
    import DataStatistics from './tiles/DataStatistics';

    export default {

        components: {DataStatistics},

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    $gap-size: 0.5em;

    .dashboard {
        @include size(100%);
        display: grid;
        grid-template-rows: repeat(4, 1fr);
        grid-template-columns: repeat(3, 1fr);
        grid-gap: $gap-size;
        padding: $gap-size;
    }

    .tile {
        border-radius: 0.25em;
        background: white;
        border: 2px solid $palette-sick-white;
        padding: 1.25em 0.75em;

        &.data-statistics {
            grid-column: 1 / 1;
            grid-row: 1 / 1;
        }
    }


</style>
