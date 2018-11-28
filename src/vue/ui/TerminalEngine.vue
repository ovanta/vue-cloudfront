<template>
    <section v-click-outside-of-element="blur"
             ref="terminal"
             class="terminal-engine"
             @click="focus"
             @blur="blur">

        <!-- Previous commands and their result -->
        <div v-for="cmd of cmds" class="command">
            <div class="location">{{ cmd.title }}</div>
            <p>{{ commandChar }} {{ cmd.command }} <br v-if="cmd.result">{{ cmd.result }} </p>
        </div>

        <!-- Input field -->
        <div class="location">{{ title }}</div>

        <div class="input">
            <span class="left-hand">{{ commandChar }} {{ leftHand }}</span>
            <span v-if="focused" class="cursor">{{ rightHand[0] || ' ' }}</span>
            <span class="right-hand">{{ rightHand.substring(1) }}</span>
        </div>

    </section>
</template>

<script>

    export default {

        props: {
            title: {
                type: String,
                required: true
            },

            commandChar: {
                type: String,
                default: '$'
            }
        },

        data() {
            return {
                cmds: [],

                // Used to walk through history
                cmdsIndex: 0,

                leftHand: '',
                rightHand: '',
                focused: false
            };
        },

        computed: {

            command() {
                return this.leftHand + this.rightHand;
            },

            parsedCommand() {
                const [, lh, rh] = this.command.match(/^([^ ]*)(.*)/);
                return {
                    cmd: lh.toLowerCase().trim(),
                    params: rh.trim()
                };
            }

        },

        updated() {

            // Scroll down
            this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight;
        },

        methods: {

            focus() {
                this.focused = true;
                this.on(window, 'keydown', this.keydown);
            },

            blur() {
                this.focused = false;
                this.off(window, 'keydown', this.keydown);
            },

            keydown(e) {
                const {key} = e;

                if (key.length === 1) {

                    // Append char to left-hand container
                    this.leftHand += key;
                } else if (key === 'Tab') {

                    // Fire auto completion
                    this.tabKey();
                } else if (key === 'Enter') {

                    // Submit command and clear input
                    this.enterKey();
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
                } else if (key === 'ArrowDown' && this.cmdsIndex > 0) {

                    // Go down in history
                    this.cmdsIndex--;
                    this.leftHand = this.cmds[this.cmdsIndex].command;
                    this.rightHand = '';
                } else if (key === 'ArrowUp') {

                    if ((this.cmdsIndex + 1) < this.cmds.length) {

                        // Go up in history
                        this.cmdsIndex++;
                        this.leftHand = this.cmds[this.cmdsIndex].command;
                    } else {
                        this.cmdsIndex = this.cmds.length;
                        this.leftHand = '';
                    }
                }
            },

            tabKey() {

                // Emit event
                const that = this;
                this.$emit('tab', {
                    ...that.parsedCommand,
                    history: that.cmds,
                    leftHand: that.leftHand,
                    rightHand: that.rightHand,

                    // Can be used to set the text left from the cursor
                    setLeftHand(str) {
                        that.leftHand = str;
                    },

                    // Can be used to set the text right from the cursor
                    setRightHand(str) {
                        that.rightHand = str;
                    }
                });
            },

            enterKey() {

                // Emit event
                const that = this;
                this.$emit('enter', {
                    ...that.parsedCommand,
                    history: that.cmds,
                    clearTerminal: () => that.cmds = [],

                    /**
                     * Prints something into the console
                     * @param title Top line content, shouldn't be empty
                     * @param result Command result, can be empty
                     */
                    append(title = '', result = '') {

                        // Append command
                        that.cmds.push({
                            title, result,
                            command: that.command,
                            timestamp: Date.now()
                        });

                        // Increment history index
                        that.cmdsIndex++;

                        // Clear input
                        that.leftHand = that.rightHand = '';
                    }
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .terminal-engine {
        @include flex(column);
        @include size(100%);
        overflow-y: auto;
        overflow-x: hidden;
        font-family: monospace;
        user-select: text;
        cursor: text;
    }

    .command {
        margin-bottom: 0.5em;

        p {
            white-space: pre;
        }
    }

    .location {
        color: $palette-grayish-blue;
    }

    .input {
        @include flex(row, stretch);
        min-height: 1em;
        margin-bottom: 2em;

        .left-hand {
            white-space: pre-wrap; // Without a single space won't be visible
        }

        .left-hand,
        .right-hand {
            line-break: loose;
            word-break: break-all;
        }

        .cursor {
            white-space: pre-wrap;

            @include animate('1s linear infinite') {
                0%, 50% {
                    background: $palette-deep-blue;
                    color: white;
                }
                51%, 100% {
                    background: white;
                    color: $palette-deep-blue;
                }
            }
        }
    }

</style>
