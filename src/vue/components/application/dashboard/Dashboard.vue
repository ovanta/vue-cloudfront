<template>
    <div class="dashboard">

        <!-- Dashboard tiles -->
        <data-statistics class="tile"/>
        <active-sessions class="tile"/>
        <group-statistics class="tile"/>

    </div>
</template>

<script>

    // Components
    import DataStatistics  from './tiles/DataStatistics';
    import ActiveSessions  from './tiles/ActiveSessions';
    import GroupStatistics from './tiles/GroupStatistics';

    export default {

        components: {DataStatistics, ActiveSessions, GroupStatistics},

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

        /deep/ > h1 {
            @include flex(row, center);
            @include font(600, 1em);
            margin: 0 0 1em 0.25em;
            color: $palette-asphalt;

            i {
                font-size: 1em;
                margin-right: 0.35em;
            }
        }

        &.no-padding {
            padding: 0;
        }

        &.no-v-padding {
            padding: 2.5vh 0;

            /deep/ > h1 {
                margin-left: calc(0.25em + 0.75vw);
            }
        }

        &.no-h-padding {
            padding: 0 0.75vw;
        }

        &.data-statistics {
            grid-area: 1 / 1 / 1 / 1;
        }

        &.active-sessions {
            grid-area: 2 / 2 / 1 / 4;
        }
    }

    @include MQPhones {
        .dashboard {
            grid-template-rows: repeat(auto-fill, 1fr);
            grid-template-columns: 1fr;
            overflow: auto;
        }

        .tile {

            &.data-statistics {
                grid-area: 1;
            }

            &.active-sessions {
                grid-area: 2;
            }
        }
    }

</style>
