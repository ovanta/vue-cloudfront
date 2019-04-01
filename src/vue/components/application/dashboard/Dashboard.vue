<template>
    <div class="dashboard">

        <data-statistics class="tile"/>
        <active-sessions class="tile"/>

    </div>
</template>

<script>

    // Components
    import DataStatistics from './tiles/DataStatistics';
    import ActiveSessions from './tiles/ActiveSessions';

    export default {

        components: {DataStatistics, ActiveSessions},

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
        padding: 2.5vh 0.75vw;

        &.data-statistics {
            grid-area: 1 / 1 / 1 / 1;
        }

        &.active-sessions {
            grid-area: 2 / 2 / 1 / 4;
        }
    }


</style>
