<template>
    <div :class="{checkbox: 1, checked: pchecked}" @click="toggle()">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" :style="{stroke: color}">
            <path pathLength="1000" d="M7,25L17.571,38,44,12"></path>
        </svg>
    </div>
</template>

<script>

    export default {
        props: {
            checked: {
                type: Boolean,
                default: false
            },

            color: {
                type: String,
                default: null
            }
        },

        data() {
            return {
                pchecked: this.checked
            };
        },

        methods: {
            toggle() {
                this.pchecked = !this.pchecked;
                this.$emit('change', this.pchecked);
            }
        }
    };

</script>


<style lang="scss" scoped>

    .checkbox {
        @include size(21px); // Fixed size to keep aspect ratio
        background: rgba($palette-grayish-blue, 0.15);
        border-radius: 0.15em;
        cursor: pointer;

        svg {
            @include size(100%);
            fill: transparent;
            cursor: pointer;
            stroke: transparent;
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            stroke-width: 0.3em;
            border-radius: 0.1em;
            transition: all 0.3s ease-in-out;
        }

        &.checked {
            background: transparent;

            svg {
                stroke-dashoffset: 0;
                stroke: $palette-deep-blue;
            }
        }
    }


</style>
