<template>
    <div ref="textSwitchButton" class="text-switch-button">

        <span v-for="(opt, index) of options"
              ref="options"
              :key="opt"
              :class="{option: 1, active: idx === index}"
              @click="select(index)">
            {{ opt }}
        </span>

        <span ref="button" class="button"></span>

    </div>
</template>

<script>

    export default {
        props: {
            active: {
                type: Number,
                required: true
            },

            options: {
                type: Array,
                required: true
            }
        },

        data() {
            return {
                idx: this.active
            };
        },

        mounted() {
            const {textSwitchButton} = this.$refs;

            (function checkVisibilty() {
                if (!textSwitchButton.offsetWidth) {
                    return requestAnimationFrame(checkVisibilty.bind(this));
                }
                this.select(this.active, true);

            }).bind(this)();
        },

        methods: {

            select(index, silent = false) {
                const {button, options} = this.$refs;

                // Calculate offset
                let px = 0;
                for (let i = 0; i < index; i++) {
                    px += options[i].offsetWidth;
                }

                // Update button position
                button.style.width = `${options[index].offsetWidth}px`;
                button.style.left = `${px}px`;

                // Fire event
                !silent && this.$emit('change', this.options[index]);

                this.idx = index;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .text-switch-button {
        position: relative;
        @include flex(row, center);
        @include font(600, 0.7em);
        background: RGB(var(--secondary-background-color));
        border-radius: 50em;
        height: 21px;
        cursor: pointer;
    }

    .option {
        padding: 0 0.75em;
        transition: all 0.3s;
        color: RGB(var(--secondary-text-color));
        z-index: 1;

        &.active {
            color: RGB(var(--teritary-text-color));
        }
    }

    .button {
        position: absolute;
        transition: all 0.3s;
        border-radius: 50em;
        height: 100%;
        background: RGB(var(--theme-primary));

        left: 0;
        top: 0;
        margin: 0;
    }

</style>
