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
        @include position(0, 0, 0, 0);
        position: absolute;
        background: RGB(var(--primary-background-color));
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
