<template>
    <div :class="{overlay: 1, open}">
        <slot></slot>
    </div>
</template>

<script>

    export default {

        props: {
            open: {
                type: Boolean,
                required: true
            }
        },

        data() {
            return {};
        }

    };

</script>

<style lang="scss" scoped>

    .overlay {
        position: absolute;
        @include position(0, 0, 0, 0);
        background: $palette-snow-white;
        z-index: 5;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;

        &.open {
            opacity: 1;
            pointer-events: all;
        }
    }

</style>
