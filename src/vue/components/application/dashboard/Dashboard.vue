<template>
    <div class="dashboard">

        <!-- Dashboard tiles -->
        <data-statistics class="tile"/>
        <active-sessions class="tile"/>
        <group-statistics class="tile"/>
        <error-log class="tile"/>
        <digital-clock class="tile "/>

    </div>
</template>

<script>

    // Components
    import DataStatistics  from './tiles/DataStatistics';
    import ActiveSessions  from './tiles/ActiveSessions';
    import GroupStatistics from './tiles/GroupStatistics';
    import ErrorLog        from './tiles/ErrorLog';
    import DigitalClock    from './tiles/DigitalClock';

    export default {

        components: {DataStatistics, ActiveSessions, GroupStatistics, ErrorLog, DigitalClock},

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
        opacity: 0;
        transform: translateY(-0.1em);

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

        &.digital-clock {
            grid-area: 2 / 2 / 3 / 4;
        }

        &.group-statistics {
            grid-area: 2 / 1 / 3 / 2;
        }

        &.active-sessions {
            grid-area: 1 / 2 / 1 / 4;
        }

        &.error-log {
            grid-area: 3 / 1 / 5 / 4;
        }

        @include sequential-animation-delay(5, 0.05s);
        @include animate('0.3s ease-in forwards') {
            to {
                opacity: 1;
                transform: none;
            }
        }
    }

    @include mq-phones {
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

            &.group-statistics {
                grid-area: 3;
            }

            &.error-log {
                grid-area: 4;
            }
        }
    }

</style>
