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
                // es-lint-no-empty
                if (cmd) {
                    // TODO: Add autocomplete
                }
            },

            submit() {
                const store = this.$store;
                const cmd = this.input;

                const append = (content = '') => {
                    return this.cmds.push({
                        location: this.location, content
                    });
                };

                // Show help
                if (cmd === 'help') {
                    return append(`
                            ls = See files / folders of current location
                            cd [NAME] = Go to directory
                            cd .. = go up
                            mkdir [NAME] = create a directory
                        `.trim()
                    );
                }

                // List folders and files of current location
                if (cmd === 'ls') {
                    const locHash = store.state.location.node.hash;
                    const names = store.state.nodes
                        .filter(n => n.parent === locHash)
                        .sort(n => n.type === 'folder' ? -1 : 1)
                        .map(v => v.name)
                        .join('\n');

                    append(names);
                }

                // Change directory
                if (cmd.startsWith('cd')) {
                    const [, , target] = cmd.match(/^cd( |)(.*)/);

                    // Check if user wants to go up
                    if (target === '..') {
                        append();
                        store.dispatch('location/goUp');
                        return;
                    }

                    // Find node where the name matches your submitted target
                    const locHash = store.state.location.node.hash;
                    const newLoc = store.state.nodes.filter(n => n.parent === locHash)
                        .find(n => n.name === target);

                    // Show error if not found, change loc otherwise
                    if (newLoc) {
                        append();
                        return store.commit('location/update', newLoc);
                    } else {
                        append(`${target}: No such directory`);
                    }
                }

                // Create a directory
                if (cmd.startsWith('mkdir')) {
                    const [, , name] = cmd.match(/^mkdir( |)(.*)/);

                    // Validate name and create directory
                    if (name.length) {
                        return store.dispatch('nodes/createFolder', store.state.location.node).then(node => {
                            return store.dispatch('nodes/rename', {node, newName: name});
                        }).then(() => {
                            append(`Folder created: '${name}'`);
                        });
                    } else {
                        return append(`'${name}' is not a valid name`);
                    }
                }

                append('Unknown command. Type `help` to see all commands.');
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
