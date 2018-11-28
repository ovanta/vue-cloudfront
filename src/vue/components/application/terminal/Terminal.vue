<template>
    <section class="terminal">

        <div class="header">
            <h1>Terminal</h1>
            <small>Type `help` to see all available commands</small>
        </div>

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

                // Header is always the current location so re-create the function
                const appendTo = append.bind(null, this.location);

                // Parses strings like `"vala valb" valc 'valu'` to ['vala valb', 'valc', 'valu']
                const parseArgStrings = str => {
                    const args = [];
                    const regexp = /([ \t])*('(.*?)'|"(.*?)"|[^ ]+)/g;
                    for (let match; (match = regexp.exec(str));) {
                        args.push(match[4] || match[3] || match[2]);
                    }
                    return args;
                };

                // this does not point to the current vue instance in objects
                const that = this;

                // Available commands and their handler
                const commands = {

                    // Show help
                    help() {
                        appendTo([
                            'ls                              List files / folders of current location',
                            'cd [String]                     Go to directory',
                            'cd ..                           Go up in folder hierarchy',
                            'mkdir [String]                  Create a directory',
                            'rm [String] | /[RegExp]/[Flags] Delete a file or folder',
                            'rename [String] [String]        Renames a file or folder',
                            'mov [String...] [String]        Move a file / folder into another directory',
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
                        const [name, newName] = parseArgStrings(params);

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
                        const [source, dest] = parseArgStrings(params);

                        // Validate
                        if (!source || !dest) {
                            return appendTo(`Cannot move ${source} to ${dest | 'nowhere'}`);
                        }

                        // Split into array
                        const sources = source.split(/(?<=[^\\]),/g);

                        // Find source / dest
                        const locHash = store.state.location.node.hash;
                        const sourceNodes = store.state.nodes.filter(n => n.parent === locHash && sources.includes(n.name));
                        const destNode = store.state.nodes.find(n => n.parent === locHash && n.name === dest);

                        // Validate
                        if (!destNode) {
                            return appendTo(`${dest}':no such directory`);
                        }

                        // Move
                        store.dispatch('nodes/move', {nodes: sourceNodes, destination: destNode});
                        appendTo();
                    },

                    logout() {
                        that.$store.commit('auth/update', {key: null});
                        clearTerminal();
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
        @include flex(column);
        height: 100%;
        margin: 2em 1.5em 0 1.5em;

        .header {
            @include flex(row, center);
            border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
            padding-bottom: 0.25em;
            flex-shrink: 0;

            h1 {
                @include font(400, 1.25em);
                color: $palette-deep-blue;
                margin-right: auto;
            }

            small {
                font-size: 0.75em;
                font-style: italic;
            }
        }

        .terminal-engine {
            margin-top: 0.5em;
            flex-grow: 1;
        }
    }

</style>
