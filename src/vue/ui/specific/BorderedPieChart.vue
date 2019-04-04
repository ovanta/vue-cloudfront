<template>
    <div class="bordered-pie-chart">

        <svg :stroke-width="strokeWidth"
             viewBox="0 0 20 20">

            <!-- Only used as background-color -->
            <circle cx="10"
                    cy="10"
                    class="background"
                    r="8.5"></circle>

            <!-- Actual progressbar -->
            <circle v-for="val of prepared"
                    :stroke-dashoffset="53.40707511102649 - val.value * 53.40707511102649"
                    :style="{stroke: val.color, transform: `rotate(${val.sumVal * 360}deg)`}"
                    class="tile"
                    cx="10"
                    cy="10"
                    r="8.5"></circle>
        </svg>

        <div class="labels">
            <div v-for="val of prepared">
                <span :style="{background: val.color}"></span>
                <p>{{ val.label }}</p>
            </div>
        </div>

    </div>
</template>


<script>

    export default {
        props: {
            values: {
                type: Array,
                required: true
            },
            labels: {
                type: Array,
                required: true
            },
            strokeWidth: {
                type: Number,
                default: 2.25
            }
        },

        computed: {

            prepared() {
                const values = [...this.values];
                const all = values.reduce((acc, cv) => acc + cv, 0);

                // Convert to percent
                const stepSize = 250 / values.length;
                for (let i = 0, l = values.length; i < l; i++) {
                    values[i] = {
                        label: this.labels[i],
                        value: values[i] / all,
                        color: `hsl(${200 + i * stepSize}, 78%, 68%)`
                    };
                }

                // Sort
                values.sort((a, b) => a.value - b.value);

                // Compute percentual rotation
                for (let l = values.length, i = l - 2; i >= 0; i--) {
                    const {value, sumVal} = values[i + 1];
                    values[i].sumVal = value + (sumVal || 0);
                }

                return values;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .bordered-pie-chart {
        @include flex(column, center, center);

        svg {
            @include size(9vmax);
            overflow: visible;
            transform-origin: center;
            transform: rotateZ(-90deg);
            shape-rendering: geometricPrecision;

            circle {
                @include size(100%);
                fill: transparent;

                &.background {
                    stroke: rgba($palette-asphalt, 0.1);
                }

                &.tile {
                    stroke-dasharray: 53.40707511102649;
                    transform-origin: center;
                    transition: all 0.3s;
                }
            }
        }

        .labels {
            @include flex(row, center, center);
            flex-wrap: wrap;
            margin-top: 10%;

            div {
                @include flex(row, center);
                margin: 0.25em 0.5em;

                span {
                    display: inline-block;
                    @include size(8px);
                    border-radius: 2px;
                    margin-right: 0.35em;
                    margin-bottom: -2px;
                }

                p {
                    @include font(600, 0.8em);
                    text-transform: capitalize;
                    color: $palette-asphalt;
                }
            }
        }
    }

</style>
