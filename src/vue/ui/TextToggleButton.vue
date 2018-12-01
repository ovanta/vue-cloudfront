<template>
    <div :class="{'text-toggle-button': 1, active}" @click="toggle">
        <span>{{ text }}</span>
    </div>
</template>


<script>

    export default {
        props: {
            text: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                active: false
            };
        },

        methods: {

            toggle() {
                this.active = !this.active;

                // Fire event
                this.$emit('change', this.active);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .text-toggle-button {
        @include flex(row, center);
        @include font(600, 0.7em);
        background: $palette-snow-white;
        border-radius: 50em;
        height: 21px;
        cursor: pointer;
        transition: all 0.3s;
        padding-bottom: 0.1em;

        &.active {
            background: $palette-deep-purple;
            box-shadow: none;

            span {
                color: $palette-snow-white;
            }
        }
    }

    span {
        padding: 0 0.75em;
        transition: all 0.3s;
        color: rgba($palette-grayish-blue, 0.75);
    }

</style>
