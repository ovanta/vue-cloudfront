<template>
    <section v-click-outside-of-element="blur"
             ref="terminal"
             class="terminal-engine"
             @blur="blur"
             @click="focus">

        <!-- Previous commands and their result -->
        <div v-for="cmd of cmds" class="command">
            <div class="location">{{ cmd.title }}</div>
            <p>{{ commandChar }} {{ cmd.command }} <br v-if="cmd.result">{{ cmd.result }} </p>
        </div>

        <!-- Input field -->
        <div class="location">{{ title }}</div>
        <enhanced-input-field ref="inputField"
                              @input="updateInput"/>

    </section>
</template>

<script>

    // Components
    import EnhancedInputField from './EnhancedInputField';

    export default {

        components: {EnhancedInputField},

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
                cmdsIndex: 0
            };
        },

        updated() {

            // Scroll down
            this.$refs.terminal.scrollTop = this.$refs.terminal.scrollHeight;
        },

        methods: {

            focus() {
                this.$refs.inputField.focus();
            },

            blur() {
                this.$refs.inputField.blur();
            },

            updateInput({event, input, left, right}) {
                const {key} = event;

                if (key === 'ArrowDown' && this.cmdsIndex > 0) {

                    // Go down in history
                    this.cmdsIndex--;
                    this.$refs.inputField.setValue(this.cmds[this.cmdsIndex].command);
                } else if (key === 'ArrowUp') {
                    if ((this.cmdsIndex + 1) < this.cmds.length) {

                        // Go up in history
                        this.cmdsIndex++;
                        this.$refs.inputField.setValue(this.cmds[this.cmdsIndex].command);
                    } else {
                        this.cmdsIndex = this.cmds.length;
                        this.$refs.inputField.setValue('');
                    }
                }

                // Emit event
                const that = this;
                this.$emit('input', {
                    event,
                    command: input,
                    history: this.cmds,
                    leftHand: left,
                    rightHand: right,
                    setValue: this.$refs.inputField.setValue,

                    /**
                     * Prints something into the console
                     * @param title Top line content, shouldn't be empty
                     * @param result Command result, can be empty
                     */
                    append(title = '', result = '') {

                        // Append command
                        that.cmds.push({
                            title, result,
                            command: input,
                            timestamp: Date.now()
                        });

                        // Increment history index
                        that.cmdsIndex++;

                        // Clear input
                        that.$refs.inputField.setValue('');
                    },

                    // Clears the terminal
                    clearTerminal: () => that.cmds = []
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

</style>
