<template>
    <section v-click-outside-of-element="blur"
             ref="terminal"
             class="terminal"
             @click="focus"
             @blur="blur">

        <div v-for="cmd of cmds" class="command">
            <div class="location">{{ cmd.location }}</div>
            <p>{{ cmd.content }}</p>
        </div>


        <div class="location">{{ location }}</div>
        <div class="input">
            <span>$ {{ input }}</span>
            <span v-if="focused" class="cursor"></span>
        </div>

    </section>
</template>

<script>


    export default {

        data() {
            return {
                cmds: [],

                input: '',
                focused: false
            };
        },

        computed: {

            location() {
                return this.$store.getters['location/getHierarchy']
                    .map(v => v.name)
                    .join('/');
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
                    this.input += key;
                } else if (key === 'Tab') {
                    this.autoComplete();
                } else if (key === 'Enter') {
                    this.submit();
                    this.input = '';
                } else if (key === 'Backspace') {
                    this.input = this.input.substring(0, this.input.length - 1);
                }
            },

            autoComplete() {
                const [, cmd] = this.input.match(/ ([^ ]+)$/);

                // Check if there is something to autocomplete
                if (cmd) {
                    const locHash = this.$store.state.location.node.hash;
                    const node = this.$store.state.nodes
                        .find(v => v.parent === locHash && v.name.startsWith(cmd));

                    if (node) {
                        this.input = this.input.replace(/([^ ]+)$/, node.name);
                    }
                }
            },

            submit() {
                const store = this.$store;
                let [, cmd, rest] = this.input.match(/^([^ ]*)(.*)/);

                const append = (content = '') => {
                    return this.cmds.push({
                        location: this.location,
                        content: `$ ${this.input}\n` + content
                    });
                };

                const that = this;
                const commands = {

                    // Show help
                    help() {
                        append([
                            'ls             See files / folders of current location',
                            'cd [NAME]      Go to directory',
                            'cd ..          Go up',
                            'mkdir [NAME]   Create a directory',
                            'rm [NAME]      Delete a file or folder',
                            'clear          Clears the terminal',
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
                    }
                };

                cmd = cmd.toLowerCase();
                if (cmd in commands) {
                    rest = rest.trim();
                    commands[cmd]();
                } else {
                    append('Unknown command. Type `help` to see all commands.');
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
        margin-bottom: 2em;

        .cursor {
            display: inline-block;
            width: 7px;
            background: $palette-deep-blue;
            margin-left: 0.15em;

            @include animate('1s linear infinite') {
                0%, 50% {
                    visibility: hidden;
                }
                51%, 100% {
                    visibility: visible;
                }
            }
        }
    }

</style>
