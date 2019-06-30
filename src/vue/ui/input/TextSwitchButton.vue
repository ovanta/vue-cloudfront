<template>
    <div ref="textSwitchButton" class="text-switch-button">

        <span v-for="(opt, index) of options"
              ref="options"
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
                } else {
                    this.select(this.active, true);
                }
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
        background: #{'rgb(var(--palette-snow-white))'};
        border-radius: 50em;
        height: 21px;
        cursor: pointer;
    }

    .option {
        padding: 0 0.75em;
        transition: all 0.3s;
        color: #{'rgba(var(--palette-blurry-gray), 0.75)'};
        z-index: 1;

        &.active {
            color: #{'rgb(var(--palette-snow-white))'};

            &:hover {
                color: #{'rgb(var(--palette-snow-white))'};
            }
        }
    }

    .button {
        position: absolute;
        transition: all 0.3s;
        border-radius: 50em;
        height: 100%;
        background: #{'rgb(var(--palette-theme-primary))'};

        left: 0;
        top: 0;
        margin: 0;
    }

</style>
