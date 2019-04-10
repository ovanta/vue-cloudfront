<template>
    <div class="digital-clock">

        <div class="date">
            <seven-segment :number="Math.floor(date.day / 10)"/>
            <seven-segment :number="date.day % 10"/>

            <div class="dot"></div>

            <seven-segment :number="Math.floor(date.month / 10)"/>
            <seven-segment :number="date.month % 10"/>

            <div class="dot"></div>

            <seven-segment :number="Math.floor(date.year / 1000)"/>
            <seven-segment :number="Math.floor((date.year % 1000) / 100)"/>
            <seven-segment :number="Math.floor((date.year % 100) / 10)"/>
            <seven-segment :number="date.year % 10"/>
        </div>

        <div class="clock">
            <seven-segment :number="Math.floor(time.hours / 10)"/>
            <seven-segment :number="time.hours % 10"/>

            <div class="dots"></div>

            <seven-segment :number="Math.floor(time.minutes / 10)"/>
            <seven-segment :number="time.minutes % 10"/>

            <div class="dots"></div>

            <seven-segment :number="Math.floor(time.seconds / 10)"/>
            <seven-segment :number="time.seconds % 10"/>
        </div>

    </div>
</template>

<script>

    // UI Components
    import SevenSegment from '../../../../ui/specific/SevenSegment';

    export default {

        components: {SevenSegment},

        data() {
            return {
                timer: 0,

                date: {
                    day: 0,
                    month: 0,
                    year: 0
                },

                time: {
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                }
            };
        },

        mounted() {
            const {time, date} = this;

            this.timer = setInterval(() => {
                requestAnimationFrame(() => {
                    const d = new Date();
                    time.hours = d.getHours();
                    time.minutes = d.getMinutes();
                    time.seconds = d.getSeconds();
                    date.day = d.getDate();
                    date.month = d.getMonth();
                    date.year = d.getFullYear();
                });
            }, 500);
        },

        destroyed() {
            clearInterval(this.timer);
        }
    };

</script>


<style lang="scss" scoped>

    .digital-clock {
        @include flex(column, center, center);
    }

    .date,
    .clock{
        @include flex(row, center, center);

        .seven-segment {
            height: auto;
            margin: 0.5em 0.15em;
        }
    }

    .clock {
        .seven-segment {
            width: 8%;
        }

        .dots {
            @include size( 1em,1em);
            position: relative;

            &::before,
            &::after {
                @include pseudo();
                @include size(6px);
                @include position(auto, 0, auto, 0);
                margin: auto;
                border-radius: 100%;
                background: $palette-asphalt;
            }

            &::before {
                top: 0;
            }

            &::after {
                bottom: 0;
            }
        }
    }

    .date{

        .seven-segment {
            width: 1.5vmin;
            margin: 0.5em 0.075em;
        }

        .dot {
            @include size(4px);
            border-radius: 100%;
            background: $palette-asphalt;
            margin: 0 0.25em 0.6em;
            align-self: flex-end;
        }
    }

</style>
