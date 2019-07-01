<template>
    <div :class="{'text-toggle-button': 1, active: state}" @click="toggle">
        <span>{{ text }}</span>
    </div>
</template>

<script>

    export default {
        props: {
            state: {type: Boolean, required: true},
            text: {type: String, required: true}
        },

        data() {
            return {};
        },

        methods: {

            toggle() {

                // Fire event
                this.$emit('change', !this.state);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .text-toggle-button {
        @include flex(row, center);
        @include font(600, 0.7em);
        background: RGB(var(--secondary-background-color));
        border-radius: 50em;
        height: 21px;
        cursor: pointer;
        transition: all 0.3s;

        &.active {
            background: RGB(var(--palette-theme-primary));
            box-shadow: none;

            span {
                color: RGB(var(--secondary-background-color));
            }
        }
    }

    span {
        padding: 0 0.75em;
        transition: all 0.3s;
        color: RGBA(var(--secondary-text-color), 0.75);
    }

</style>
