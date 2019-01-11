<template>
    <svg class="circle-progress-bar" viewBox="0 0 20 20">

        <!-- Only used as background-color -->
        <circle cx="10"
                cy="10"
                class="background"
                r="8.5"></circle>

        <!-- Actual progressbar -->
        <circle :stroke-dashoffset="53.40707511102649 - (utils.limit(value, 0, 1) * 53.40707511102649)"
                cx="10"
                cy="10"
                r="8.5"
                class="progress"></circle>
    </svg>
</template>

<script>

    export default {

        props: {
            value: {
                type: Number,
                required: true
            }
        }

    };

</script>

<style lang="scss" scoped>

    .circle-progress-bar {
        @include size(1.25em);
        overflow: visible;
        transform-origin: center;
        transform: rotateZ(-90deg);
        shape-rendering: geometricPrecision;

        circle {
            @include size(100%);
            stroke-width: 2.5;
            fill: transparent;

            &.progress {
                stroke: $palette-deep-purple;
                stroke-dasharray: 53.40707511102649;
            }

            &.background {
                stroke: $palette-decent-blue;
            }
        }
    }

</style>
