<template>
    <section class="terminal">
        <terminal-engine :title="location"
                         @tab="tabKey"
                         @enter="enterKey"></terminal-engine>
    </section>
</template>

<script>

    // Components
    import TerminalEngine from '../../../ui/TerminalEngine';

    export default {

        components: {TerminalEngine},

        data() {
            return {};
        },

        computed: {

            location() {
                return this.$store.getters['location/getHierarchy']
                    .map(v => v.name)
                    .join('/');
            }

        },

        methods: {

            tabKey({leftHand, setLeftHand}) {
                const lmatch = leftHand.match(/ ([^ ]+)$/);

                // Check if there is something to autocomplete
                if (lmatch) {
                    const cmd = lmatch[1].toLowerCase();
                    const locHash = this.$store.state.location.node.hash;
                    const node = this.$store.state.nodes
                        .find(v => v.parent === locHash && v.name.toLowerCase().startsWith(cmd));

                    if (node) {
                        setLeftHand(leftHand.replace(/([^ ]+)$/, node.name));
                    }
                }
            },

            enterKey({cmd, params, append}) {
                const store = this.$store;

                const appendTo = append.bind(null, this.location);

                const that = this;
                const commands = {

                    // Show help
                    help() {
                        appendTo([
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

                        appendTo(names || 'Nothing here...');
                    },

                    // Change directory
                    cd() {

                        // Check if user wants to go up
                        if (params === '..') {
                            appendTo();
                            store.dispatch('location/goUp');
                            return;
                        }

                        // Find node where the name matches your submitted target
                        const locHash = store.state.location.node.hash;
                        const newLoc = store.state.nodes.find(n => n.parent === locHash && n.type === 'folder' && n.name === params);

                        // Show error if not found, change loc otherwise
                        if (newLoc) {
                            appendTo();
                            store.commit('location/update', newLoc);
                        } else {
                            appendTo(`'${params}': No such directory`);
                        }
                    },

                    // Create a directory
                    mkdir() {

                        // Validate name and create directory
                        if (params.length) {
                            appendTo();
                            store.dispatch('nodes/createFolder', store.state.location.node).then(node => {
                                return store.dispatch('nodes/rename', {node, newName: params});
                            });
                        } else {
                            appendTo(`'${params}' is not a valid name`);
                        }
                    },

                    rm() {

                        // Find node
                        const locHash = store.state.location.node.hash;
                        const node = store.state.nodes.find(n => n.parent === locHash && n.name === params);

                        // Check if node exists
                        if (node) {
                            appendTo();
                            store.dispatch('nodes/delete', [node]);
                        } else {
                            appendTo(`'${params}': No such file or directory`);
                        }
                    },

                    clear() {
                        that.cmds = [];
                    },

                    rename() {
                        const regexName = params.match(/(.*?)[ '"].*?['"](.*?)['"]/);
                        let name, newName;

                        // Check if user has used quotes
                        if (regexName && regexName.length > 2) {
                            [, name, newName] = regexName;
                        } else {
                            [name, newName] = params.split(/ /);
                        }

                        // Validate
                        if (!name || !newName) {
                            return appendTo(`Cannot rename ${name} to ${newName}`);
                        }

                        // Find node
                        const locHash = store.state.location.node.hash;
                        const node = store.state.nodes.find(n => n.parent === locHash && n.name === name);

                        // Validate node
                        if (!node) {
                            return appendTo(`'${name}': No such file or directory`);
                        }

                        // Rename
                        store.dispatch('nodes/rename', {node, newName});
                        appendTo();
                    },

                    logout() {
                        that.$store.commit('auth/setSessionKey', '');
                        this.clear();
                    }
                };

                // Check if command exists
                if (cmd in commands) {
                    commands[cmd]();
                } else {

                    // Display error message
                    appendTo(`Unknown command '${cmd}'. Type 'help' to see all commands.`);
                }
            }

        }

    };

</script>

<style lang="scss" scoped>

    .terminal {
        @include size(100%);
    }

</style>
