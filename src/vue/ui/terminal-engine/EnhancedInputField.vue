<template>
    <div class="enhanced-input-field"
         @blur="blur"
         @click="focus">

        <span class="left-hand">{{ commandChar }} {{ input.leftHand }}</span>
        <span v-if="focused" :class="`cursor ${cursor}`">{{ input.cursorContent }}</span>
        <span class="right-hand">{{ input.rightHand }}</span>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                commandChar: '$',
                cursor: 'block',
                cursorTypes: ['block', 'line', 'underscore'],

                leftHand: '',
                rightHand: '',
                focused: false
            };
        },

        computed: {

            input() {
                const {rightHand, cursor, leftHand} = this;
                return {
                    leftHand,
                    rightHand: cursor === 'line' ? rightHand : rightHand.substring(1),
                    cursorContent: cursor === 'line' ? '' : rightHand[0] || ' '
                };
            }

        },

        methods: {

            focus() {
                this.focused = true;
                this.utils.on(window, 'keydown', this.keydown);
            },

            blur() {
                this.focused = false;
                this.utils.off(window, 'keydown', this.keydown);
            },

            setValue(val) {
                if (typeof val === 'string') {
                    this.leftHand = val;
                    this.rightHand = '';
                } else if (typeof val === 'object' && val !== null) {
                    const {left, right} = val;
                    this.leftHand = left || '';
                    this.rightHand = right || '';
                }
            },

            keydown(e) {
                const {key} = e;

                if (key.length === 1) {

                    // Append char to left-hand container
                    this.leftHand += key;
                } else if (key === 'Insert') {

                    // Rotate cursor type
                    const nextIndex = this.cursorTypes.indexOf(this.cursor) + 1;
                    this.cursor = this.cursorTypes[nextIndex > this.cursorTypes.length - 1 ? 0 : nextIndex];
                } else if (key === 'Backspace') {

                    // Delete previous char to the left of the cursor
                    this.leftHand = this.leftHand.substring(0, this.leftHand.length - 1);
                } else if (key === 'ArrowLeft' && this.leftHand) {

                    // Move cursor to the left
                    this.rightHand = this.leftHand[this.leftHand.length - 1] + this.rightHand;
                    this.leftHand = this.leftHand.substring(0, this.leftHand.length - 1);
                } else if (key === 'ArrowRight' && this.rightHand) {

                    // Move cursor to the right
                    this.leftHand = this.leftHand + this.rightHand[0];
                    this.rightHand = this.rightHand.substring(1);
                }

                // Emit event
                this.$emit('input', {
                    event: e,
                    input: this.leftHand + this.rightHand,
                    left: this.leftHand,
                    right: this.rightHand
                });
            }

        }

    };

</script>

<style lang="scss" scoped>

    .enhanced-input-field {
        @include flex(row, stretch);
        min-height: 1em;
        margin-bottom: 2em;
        user-select: text;
        cursor: default;

        .left-hand {
            white-space: pre-wrap; // Without a single space won't be visible
        }

        .left-hand,
        .right-hand {
            line-break: loose;
            word-break: break-all;

            &::selection {
                background: $palette-deep-blue;
                color: white;
            }
        }

        .cursor {
            position: relative;
            white-space: pre-wrap;

            &.block,
            &.line {
                @include animate('1s linear infinite') {
                    0%, 50% {
                        background: $palette-deep-blue;
                        color: white;
                    }
                    51%, 100% {
                        background: transparent;
                        color: $palette-deep-blue;
                    }
                }
            }

            &.line {
                margin: 0 -1px;
                width: 2px;
            }

            &.underscore {
                overflow: visible;

                &::before {
                    @include pseudo();
                    @include position(auto, 0, 0, 0);
                    @include size(110%, 1px);
                    @include animate('1s linear infinite') {
                        0%, 50% {
                            background: $palette-deep-blue;
                            color: white;
                        }
                        51%, 100% {
                            background: transparent;
                            color: $palette-deep-blue;
                        }
                    }
                }
            }
        }
    }

</style>
