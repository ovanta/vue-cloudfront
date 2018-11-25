<template>
    <section v-click-outside-of-element="blur"
             ref="terminal"
             class="terminal"
             @click="focus"
             @blur="blur">

        <!-- Previous commands and their result -->
        <div v-for="cmd of cmds" class="command">
            <div class="location">{{ cmd.location }}</div>
            <p>{{ cmd.content }}</p>
        </div>


        <!-- Input field -->
        <div class="location">{{ location }}</div>

        <div class="input">
            <span class="left-hand">$ {{ leftHand }}</span>
            <span v-if="focused" class="cursor">{{ rightHand[0] || ' ' }}</span>
            <span>{{ rightHand.substring(1) }}</span>
        </div>

    </section>
</template>

<script>


    export default {

        data() {
            return {
                cmds: [],

                leftHand: '',
                rightHand: '',
                focused: false
            };
        },

        computed: {

            location() {
                return this.$store.getters['location/getHierarchy']
                    .map(v => v.name)
                    .join('/');
            },

            input() {
                return this.leftHand + this.rightHand;
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
                    this.autoComplete();
                } else if (key === 'Enter') {

                    // Submit command and clear input
                    this.submit();
                    this.leftHand = '';
                    this.rightHand = '';
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
            },

            autoComplete() {
                const lmatch = this.leftHand.match(/ ([^ ]+)$/);

                // Check if there is something to autocomplete
                if (lmatch) {
                    const [, cmd] = lmatch;
                    const locHash = this.$store.state.location.node.hash;
                    const node = this.$store.state.nodes
                        .find(v => v.parent === locHash && v.name.startsWith(cmd));

                    if (node) {
                        this.leftHand = this.leftHand.replace(/([^ ]+)$/, node.name);
                    }
                }
            },

            submit() {
                const store = this.$store;
                const originalInput = this.input;
                let [, cmd, rest] = this.input.match(/^([^ ]*)(.*)/);

                const append = (content = '') => {
                    return this.cmds.push({
                        location: this.location,
                        content: `$ ${originalInput}\n` + content
                    });
                };

                const that = this;
                const commands = {

                    // Show help
                    help() {
                        append([
                            'ls                       See files / folders of current location',
                            'cd [NAME]                Go to directory',
                            'cd ..                    Go up',
                            'mkdir [NAME]             Create a directory',
                            'rm [NAME]                Delete a file or folder',
                            'rename [NAME] [NEW NAME] Renames a file or folder',
                            'clear                    Clears the terminal',
                            '\nPress tab to use auto-completion'
                        ].join('\n'));
                    },

                    // List folders and files of current location
                    ls() {
                        const locHash = store.state.location.node.hash;
                        const names = store.state.nodes
                            .filter(n => n.parent === locHash)
                            .sort(n => n.type === 'folder' ? -1 : 1)
                            .map(v => v.name)
                            .join('\n');

                        append(names || 'Nothing here...');
                    },

                    // Change directory
                    cd() {

                        // Check if user wants to go up
                        if (rest === '..') {
                            append();
                            store.dispatch('location/goUp');
                            return;
                        }

                        // Find node where the name matches your submitted target
                        const locHash = store.state.location.node.hash;
                        const newLoc = store.state.nodes.filter(n => n.parent === locHash)
                            .find(n => n.name === rest);

                        // Show error if not found, change loc otherwise
                        if (newLoc) {
                            append();
                            store.commit('location/update', newLoc);
                        } else {
                            append(`'${rest}': No such directory`);
                        }
                    },

                    // Create a directory
                    mkdir() {

                        // Validate name and create directory
                        if (rest.length) {
                            append();
                            store.dispatch('nodes/createFolder', store.state.location.node).then(node => {
                                return store.dispatch('nodes/rename', {node, newName: rest});
                            });
                        } else {
                            append(`'${rest}' is not a valid name`);
                        }
                    },

                    rm() {

                        // Find node
                        const locHash = store.state.location.node.hash;
                        const node = store.state.nodes.filter(n => n.parent === locHash)
                            .find(n => n.name === rest);

                        // Check if node exists
                        if (node) {
                            store.dispatch('nodes/delete', [node]).then(() => {
                                append(`'${rest}' has been sucessful deleted!`);
                            });
                        } else {
                            append(`'${rest}': No such directory`);
                        }
                    },

                    clear() {
                        that.cmds = [];
                    },

                    rename() {
                        const regexName = rest.match(/(.*?)[ '"].*?['"](.*?)['"]/);
                        let name, newName;

                        // Check if user has used quotes
                        if (regexName && regexName.length > 2) {
                            [, name, newName] = regexName;
                        } else {
                            [name, newName] = rest.split(/ /);
                        }

                        // Validate
                        if (!name || !newName) {
                            return append(`Cannot rename ${name} to ${newName}`);
                        }

                        // Find node
                        const locHash = store.state.location.node.hash;
                        const node = store.state.nodes.filter(n => n.parent === locHash)
                            .find(n => n.name === name);

                        // Validate node
                        if (!node) {
                            return append(`'${name}': No such file or directory`);
                        }

                        // Rename
                        store.dispatch('nodes/rename', {node, newName});
                        append();
                    }
                };

                cmd = cmd.toLowerCase();
                if (cmd in commands) {
                    rest = rest.trim();
                    commands[cmd]();
                } else {
                    append(`Unknown command '${originalInput}'. Type 'help' to see all commands.`);
                }
            }

        }

    };

</script>

<style lang="scss" scoped>

    .terminal {
        @include flex(column);
        @include size(100%);
        overflow-y: auto;
        font-family: monospace;
        padding: 1em;
        user-select: text;
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
