<template>
    <div :class="{tooltip: 1, visible: data.visible}" :style="data.style">
        {{ data.text }}
    </div>
</template>

<script>

    export default {

        data() {
            return {};
        },

        computed: {
            data() {
                /**
                 * It's required to extract all data since this props
                 * only get recomputet (and the element a new position)
                 * whenever the tooltip store module changes.
                 */
                const {el, visible, text} = this.$store.state.tooltip;

                // The reference element is at the beginning null
                if (!el) {
                    return {visible, text};
                }

                // Recalculate position
                const bcr = el.getBoundingClientRect();
                return {
                    style: {
                        top: `${bcr.top - 30}px`,
                        left: `${bcr.left + bcr.width / 2}px`
                    },
                    visible, text
                };
            }
        }
    };

</script>

<style lang="scss" scoped>

    .tooltip {
        position: fixed;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        padding: 0.4em 0.75em 0.5em;
        border-radius: 0.15em;
        @include font(600, 0.75em);
        background: $palette-asphalt;
        color: white;
        transform: translateY(5px) translateX(-50%);
        transition: transform 0.3s, opacity 0.3s;

        &.visible {
            opacity: 1;
            transform: translateX(-50%);
        }

        &::before {
            @include pseudo();
            @include position(auto, 0, -10px, 0);
            @include size(0);
            margin: auto;
            border: 5px solid transparent;
            border-top-color: $palette-asphalt;
        }
    }

    @include MQTablets {
        .tooltip {
            display: none;
        }
    }

</style>
