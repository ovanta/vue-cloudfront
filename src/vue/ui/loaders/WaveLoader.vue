<template>
    <div :class="{'wave-loader': 1, visible}">
        <div></div>
        <div></div>
        <div></div>
    </div>
</template>

<script>

    export default {

        props: {
            visible: {
                type: Boolean,
                required: true
            }
        }
    };

</script>

<style lang="scss" scoped>

    .wave-loader {
        @include flex(row, center, center);
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;

        > div {
            @include size(6px);
            background: $palette-deep-blue;
            margin: 0.2em;
            border-radius: 100%;
            @include sequentialAnimationDelay(3, -0.85s);
            @include animate('1s ease-in-out infinite') {
                0%, 100% {
                    transform: none;
                }
                50% {
                    transform: translateY(0.5em);
                }
            }

            animation-play-state: paused;
        }

        &.visible {
            opacity: 1;
            pointer-events: all;

            > div {
                animation-play-state: running;
            }
        }
    }

</style>
