<template>
    <svg :stroke-width="strokeWidth"
         class="circle-progress-bar"
         viewBox="0 0 20 20">

        <!-- Only used as background-color -->
        <circle cx="10"
                cy="10"
                class="background"
                r="8.5"></circle>

        <!-- Actual progressbar -->
        <circle :stroke-dashoffset="53.40707511102649 - ($utils.limit(value, 0, 1) * 53.40707511102649)"
                :class="{progress: 1, indeterminate}"
                cx="10"
                cy="10"
                r="8.5"></circle>
    </svg>
</template>

<script>

    export default {
        props: {
            value: {
                type: Number,
                required: true
            },
            indeterminate: {
                type: Boolean,
                default: false
            },
            strokeWidth: {
                type: Number,
                default: 2.25
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
            stroke-linecap: round;
            fill: transparent;

            &.progress {
                stroke: RGB(var(--palette-theme-secondary));
                stroke-dasharray: 53.40707511102649;
                transform-origin: center;

                &.indeterminate {
                    @include animate('2.5s ease-out infinite') {
                        0%, 10% {
                            stroke-dashoffset: 53.40707511102649;
                            transform: none;
                        }
                        50% {
                            stroke-dashoffset: 0;
                            transform: rotate(180deg);
                        }
                        100% {
                            stroke-dashoffset: -53.40707511102649;
                            transform: rotate(360deg);
                        }
                    }
                }
            }

            &.background {
                stroke: RGBA(var(--primary-text-color), 0.1);
            }
        }
    }

</style>
