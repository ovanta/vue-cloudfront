<template>
    <div :class="{menu: 1, open}" :style="style">

        <div class="option delete" v-if="type === 'files' || type === 'folder' || type === 'mixed'" @click="del()">
            <i class="material-icons">delete</i>
            <span class="name">Delete</span>
        </div>

        <div class="option" v-if="type === 'files'">
            <i class="material-icons">get_app</i>
            <span class="name">Download</span>
        </div>

        <div class="option" @click="newFolder()">
            <i class="material-icons">create_new_folder</i>
            <span class="name">New Folder</span>
        </div>

        <div class="option" v-if="nodes.length === 1" @click="edit()">
            <i class="material-icons">edit</i>
            <span class="name">Rename</span>
        </div>

        <div class="option" v-if="$store.state.nodes.find(v => $store.state.selection.includes(v))" @click="cut()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z"></path>
            </svg>
            <span class="name">Cut</span>
        </div>

        <div class="option" v-if="$store.state.clipboard.nodes.length" @click="paste()">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M19 2h-4.18C14.4.84 13.3 0 12 0c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm7 18H5V4h2v3h10V4h2v16z"></path>
            </svg>
            <span class="name">Paste</span>
        </div>

    </div>
</template>


<script>

    export default {

        data() {
            return {
                open: false,
                type: '',
                nodes: [],
                style: {}
            };
        },

        methods: {

            del() {
                this.$store.commit('nodes/delete', this.nodes);
                this.open = false;
            },

            edit() {
                if (this.nodes.length === 1) {
                    this.nodes[0].editable = true;
                    this.open = false;
                }
            },

            newFolder() {
                const locHash = this.$store.getters['location/currentLocation'];
                const destination = this.$store.state.nodes.find(v => v.hash === locHash);
                this.$store.commit('nodes/newFolder', destination);
                this.open = false;
            },

            cut() {
                if (this.nodes.length) {

                    // Save to clipboard
                    this.$store.commit('clipboard/insert', {
                        nodes: this.nodes,
                        type: 'cut'
                    });
                }
                this.open = false;
            },

            paste() {
                const clipboardNodes = this.$store.state.clipboard.nodes;
                const locHash = this.$store.getters['location/currentLocation'];
                if (clipboardNodes.length) {

                    // Move elements
                    this.$store.commit('nodes/move', {nodes: clipboardNodes, destination: locHash});

                    // Clear clipboard
                    this.$store.commit('clipboard/clear');
                }
                this.open = false;
            }

        },

        mounted() {

            // Close via escape key
            window.addEventListener('keyup', e => e.key === 'Escape' && (this.open = false));

            /**
             *  Event to show the menu.
             *  Nodes is an array of currently selected nodes and
             *  evt the mouseevent (contextmenu)
             */
            this.$on('show', evt => {
                this.nodes = this.$store.state.selection;
                const hasFiles = this.nodes.find(n => n.type === 'file');
                const hasFolder = this.nodes.find(n => n.type === 'folder');

                // Check which nodes are present / currently selected
                if (hasFiles && hasFolder) {
                    this.type = 'mixed';
                } else if (hasFiles) {
                    this.type = 'files';
                } else if (hasFolder) {
                    this.type = 'folder';
                } else {
                    this.type = 'none';
                }

                // Set postion
                this.style.left = `${evt.clientX + 5}px`;
                this.style.top = `${evt.clientY + 5}px`;
                this.open = true;
            });

            // Event to hide the menu
            this.$on('hide', () => this.open = false);
        }

    };

</script>


<style lang="scss" scoped>

    .menu {
        @include flex(column);
        position: fixed;
        transform: translateY(-0.1em);
        opacity: 0;
        visibility: hidden;
        transition: transform 0.3s, opacity 0.3s, visibility 0s 0s;
        background: white;
        padding: 0.5em 1em;
        box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.1);
        border-radius: 0.1em;

        &.open {
            opacity: 1;
            transform: none;
            visibility: visible;
        }

        .option {
            @include flex(row, center);
            padding: 0.35em 0;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.3s;
            color: $palette-deep-blue;

            svg {
                fill: $palette-deep-blue;
            }

            .name {
                margin-left: 0.75em;
                font-weight: 600;
                font-size: 0.95em;
            }

            &:hover {
                color: $palette-cloud-blue;
            }

            &.delete:hover {
                color: $palette-tomatoe-red;
            }
        }

    }

</style>
