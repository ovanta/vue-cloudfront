<template>
    <div ref="toolTip"
         :class="{tooltip: 1, visible: data.visible}"
         :style="data.style">

        {{ data.text }}
    </div>
</template>

<script>

    export default {

        data() {
            return {
                position: 'top' // Available are top, bottom, left and right
            };
        },

        computed: {

            data() {

                /**
                 * It's required to extract all data since this props
                 * only get recomputed (and the element a new position)
                 * whenever the tooltip store module changes.
                 */
                const {el, visible, text} = this.$store.state.tooltip;
                const {position} = this;

                // The reference element is at the very beginning null
                if (!el) {
                    return {visible, text, style: {}};
                }

                // Recalculate position
                const bcr = el.getBoundingClientRect();
                return {
                    visible, text,
                    style: (() => {
                        switch (position) {
                            case 'top':
                                return {
                                    top: `${bcr.top - 30}px`,
                                    left: `${bcr.left + bcr.width / 2}px`,
                                    transform: 'translateX(-50%)'
                                };
                            case 'bottom':
                                return {
                                    top: `${bcr.bottom}px`,
                                    left: `${bcr.left + bcr.width / 2}px`,
                                    transform: 'translateX(-50%)'
                                };
                            case 'left':
                                return {
                                    top: `${bcr.bottom - bcr.height / 2}px`,
                                    left: `${bcr.left - 30}px`,
                                    transform: 'translateY(-50%) translateX(-100%)'
                                };
                            case 'right':
                                return {
                                    top: `${bcr.bottom - bcr.height / 2}px`,
                                    left: `${bcr.right + 10}px`,
                                    transform: 'translateY(-50%)'
                                };
                        }
                    })()
                };
            }
        },

        updated() {

            // Check for clipping
            requestAnimationFrame(() => {
                const {toolTip} = this.$refs;
                const bcr = toolTip.getBoundingClientRect();

                toolTip.classList.remove(this.position);

                if (bcr.top < 0) {
                    this.position = 'bottom';
                } else if (bcr.bottom > window.innerHeight) {
                    this.position = 'top';
                } else if (bcr.left < 0) {
                    this.position = 'right';
                } else if (bcr.right > window.innerWidth) {
                    this.position = 'left';
                }

                toolTip.classList.add(this.position);
            });
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
        background: $palette-deep-blue;
        color: white;
        transition: opacity 0.3s;
        white-space: nowrap;

        &.visible {
            opacity: 1;
        }

        &::before {
            @include pseudo();
            @include size(0);
            border: 5px solid transparent;
            margin: auto;
        }

        &.top::before {
            @include position(auto, 0, -10px, 0);
            border-top-color: $palette-deep-blue;
        }

        &.bottom::before {
            @include position(-10px, 0, auto, 0);
            border-bottom-color: $palette-deep-blue;
        }

        &.right::before {
            @include position(0, auto, 0, -10px);
            border-right-color: $palette-deep-blue;
        }

        &.left::before {
            @include position(0, -10px, 0, auto);
            border-left-color: $palette-deep-blue;
        }
    }

</style>
