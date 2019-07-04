<template>
    <div ref="slider" class="slider">

        <div :style="{width: `${value * 100}%`}"
             class="bar"></div>

        <div ref="knob"
             :style="{left: `${value * 100}%`}"
             class="knob"></div>
    </div>
</template>


<script>

    export default {

        props: {
            value: {
                type: Number,
                required: true
            }
        },

        data() {
            return {
                grab: false
            };
        },

        mounted() {
            const {slider} = this.$refs;
            const {on, off} = this.$utils;

            const grabber = e => {
                this.setPosition(e);

                const listeners = [
                    on(window, ['mousemove', 'touchmove'], this.setPosition),
                    on(window, ['mouseup', 'touchend', 'touchcancel'], () => listeners.forEach(v => off(...v)))
                ];
            };

            on(slider, ['mousedown', 'touchstart'], grabber);
        },

        methods: {
            setPosition(e) {
                e.stopPropagation();
                const {x} = this.$utils.simplifyEvent(e);
                const bcr = this.$refs.slider.getBoundingClientRect();
                let value = 1 - (bcr.right - x) / bcr.width;
                if (value < 0) value = 0;
                if (value > 1) value = 1;
                this.$emit('change', value);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .slider {
        position: relative;
        @include size(0.5em, 5em);
        background: RGB(var(--secondary-text-color));
        border-radius: 50em;
        overflow: visible;
    }

    .bar {
        position: absolute;
        @include position(0, auto, 0, 0);
        @include size(100%, 0);
        background: RGB(var(--primary-text-color));
        border-radius: 50em;
    }

    .knob {
        position: absolute;
        @include size(1.25em);
        background: RGB(var(--primary-text-color));
        margin: -0.3em 0 0 -0.3em;
        border-radius: 100%;
        cursor: grab;
        cursor: -webkit-grab;
    }

</style>
