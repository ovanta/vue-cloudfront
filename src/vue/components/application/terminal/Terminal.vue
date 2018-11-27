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

            enterKey({cmd, params, append, history, clearTerminal}) {
                const store = this.$store;

                const appendTo = append.bind(null, this.location);

                const that = this;
                const commands = {

                    // Show help
                    help() {
                        appendTo([
                            'ls                              List files / folders of current location',
                            'cd [String]                     Go to directory',
                            'cd ..                           Go up in folder hierarchy',
                            'mkdir [String]                  Create a directory',
                            'rm [String] | /[RegExp]/[Flags] Delete a file or folder',
                            'rename [String] to [String]     Renames a file or folder',
                            'mov [String] to [String]        Move a file / folder into another directory',
                            'clear                           Clear terminal',
                            'history                         See command history',
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

                        // Check for regular expression
                        const nodes = [];
                        const regex = params.match(/^\/(.*)\/([\w]*)$/);
                        if (regex && regex.length > 2) {
                            const regexp = new RegExp(regex[1], regex[2]);

                            // Add nodes which match the regular expression
                            nodes.push(
                                ...store.state.nodes.filter(n => n.parent === locHash && regexp.test(n.name))
                            );
                        } else {

                            // Find single node where the name matches
                            const node = store.state.nodes.find(n => n.parent === locHash && n.name === params);
                            node && nodes.push(node);
                        }

                        appendTo();
                        store.dispatch('nodes/delete', nodes);
                    },

                    clear() {
                        appendTo();
                        clearTerminal();
                    },

                    rename() {
                        const [name, newName] = params.split(/ *(?<!\\)to */)
                            .map(v => v.replace(/\\to/g, 'to'));

                        // Validate
                        if (!name || !newName) {
                            return appendTo(`Cannot rename ${name} to ${newName | 'nothing'}`);
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

                    mov() {
                        const [source, dest] = params.split(/ *(?<!\\)to */)
                            .map(v => v.replace(/\\to/g, 'to'));

                        // Validate
                        if (!source || !dest) {
                            return appendTo(`Cannot move ${source} to ${dest | 'nowhere'}`);
                        }

                        // Find source / dest
                        const locHash = store.state.location.node.hash;
                        const sourceNode = store.state.nodes.find(n => n.parent === locHash && n.name === source);
                        const destNode = store.state.nodes.find(n => n.parent === locHash && n.name === dest);

                        // Validate
                        if (!sourceNode || !destNode) {
                            return appendTo(`'${source}' or '${dest}' is not such a file or directory`);
                        }

                        // Move
                        store.dispatch('nodes/move', {nodes: [sourceNode], destination: destNode});
                        appendTo();
                    },

                    logout() {
                        that.$store.commit('auth/setSessionKey', '');
                        this.clear();
                    },

                    history() {
                        appendTo(history.map(v => v.command).join('\n'));
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
