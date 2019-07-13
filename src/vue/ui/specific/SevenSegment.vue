<template>
    <svg class="seven-segment"
         xmlns="http://www.w3.org/2000/svg"
         width="58"
         height="104"
         viewBox="0 0 58 104">
        <path :class="{t: 1, visible: bit & 0b1000000}" d="M14,0L8,6l6,6H44l6-6L44,0H14Z"></path>
        <path :class="{tr: 1, visible: bit & 0b0100000}" d="M58,14L52,8l-6,6V44l6,6,6-6V14Z"></path>
        <path :class="{mr: 1, visible: bit & 0b0010000}" d="M58,60l-6-6-6,6V90l6,6,6-6V60Z"></path>
        <path :class="{b: 1, visible: bit & 0b0001000}" d="M14,92L8,98l6,6H44l6-6-6-6H14Z"></path>
        <path :class="{ml: 1, visible: bit & 0b0000100}" d="M12,60L6,54,0,60V90l6,6,6-6V60Z"></path>
        <path :class="{tl: 1, visible: bit & 0b0000010}" d="M12,14L6,8,0,14V44l6,6,6-6V14Z"></path>
        <path :class="{m: 1, visible: bit & 0b0000001}" d="M14,46L8,52l6,6H44l6-6-6-6H14Z"></path>
    </svg>
</template>

<script>

    export default {
        props: {
            number: {
                required: true,
                validator(val) {
                    return typeof val === 'number' && val >= 0 && val <= 9 && (val % 1 === 0);
                }
            }
        },

        data() {
            return {};
        },

        computed: {

            bit() {
                return ([
                    0b1111110,
                    0b0110000,
                    0b1101101,
                    0b1111001,
                    0b0110011,
                    0b1011011,
                    0b1011111,
                    0b1110000,
                    0b1111111,
                    0b1111011
                ])[this.number];
            }
        }
    };

</script>

<style lang="scss">

    .seven-segment {
        shape-rendering: geometricPrecision;

        path {
            fill: RGB(var(--secondary-background-color));
            stroke: transparent;
            transition: all 0.3s;

            &.visible {
                fill: RGB(var(--primary-text-color));
            }
        }
    }

</style>
