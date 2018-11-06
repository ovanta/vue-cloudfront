<template>
    <div :class="{menu: 1, open}" :style="style" ref="menuRoot">

        <div class="option star" v-if="marked || type === 'files' || type === 'folder' || type === 'mixed'" @click="star()">
            <i :class="`fa${marked ? 'r' : 's'} fa-fw fa-bookmark`"></i>
            <span class="name">{{ marked ? 'Remove mark' : 'Add mark'}}</span>
        </div>

        <div class="option delete" v-if="type === 'files' || type === 'folder' || type === 'mixed'" @click="del()">
            <i class="fas fa-fw fa-trash-alt"></i>
            <span class="name">Delete</span>
        </div>

        <div class="option" v-if="type === 'files' || type === 'folder' || type === 'mixed'" @click="download()">
            <i class="fas fa-fw fa-download"></i>
            <span class="name">Download</span>
        </div>

        <div class="option" v-if="!$store.state.search.active" @click="newFolder()">
            <i class="fas fa-fw fa-folder-plus"></i>
            <span class="name">New Folder</span>
        </div>

        <div class="option" v-if="nodes.length === 1" @click="edit()">
            <i class="fas fa-fw fa-pen"></i>
            <span class="name">Rename</span>
        </div>

        <div class="option" v-if="$store.state.selection.length" @click="moveToClipboard('copy')">
            <i class="fas fa-fw fa-copy"></i>
            <span class="name">Copy</span>
        </div>

        <div class="option" v-if="$store.state.selection.length" @click="moveToClipboard('move')">
            <i class="fas fa-fw fa-cut"></i>
            <span class="name">Cut</span>
        </div>

        <div class="option" v-if="$store.state.clipboard.nodes.length" @click="execClipboardAction()">
            <i class="fas fa-fw fa-paste"></i>
            <span class="name">Paste</span>
        </div>

        <div class="option sub" v-if="type === 'folder'">
            <i class="fas fa-fw fa-palette"></i>
            <span class="name">Change color <i class="fas fa-fw fa-angle-right"></i></span>

            <div class="sub-menu colors">
                <div class="color" v-for="color of $store.state.colors" :style="{background: color}" @click="setColor(color)"></div>
            </div>
        </div>

    </div>
</template>


<script>

    export default {

        computed: {

            /**
             * Returns a state.
             * 0: None or some are marked
             * 1: All nodes are marked
             */
            marked() {

                if (!this.nodes.length) {
                    return;
                }

                for (let i = 0, a = this.nodes.length, n; n = this.nodes[i], i < a; i++) {
                    if (!n.marked) {
                        return 0;
                    }
                }

                return 1;
            }

        },

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

            star() {
                this.$store.commit(`nodes/${ this.marked ? 'remove' : 'add' }Mark`, this.nodes);
                this.open = false;
            },

            edit() {
                if (this.nodes.length === 1) {
                    this.$store.commit('editable/set', this.nodes[0]);
                    this.open = false;
                }
            },

            download() {
                // TODO: Add download functionality
            },

            newFolder() {

                // Create a folder and immediatly make it editable
                this.$store.dispatch('nodes/createFolder', this.$store.getters['location/currentLocation']).then(folderNode => {
                    this.$store.commit('editable/set', folderNode);
                });

                this.open = false;
            },

            moveToClipboard(type) {
                if (this.nodes.length) {

                    // Save to clipboard
                    this.$store.commit('clipboard/insert', {
                        nodes: this.nodes,
                        type
                    });
                }
                this.open = false;
            },

            execClipboardAction() {
                const {clipboard} = this.$store.state;
                const clipboardNodes = clipboard.nodes;
                const locHash = this.$store.getters['location/currentLocation'];
                if (clipboardNodes.length) {

                    // Move elements
                    this.$store.commit(`nodes/${clipboard.type}`, {nodes: clipboardNodes, destination: locHash});


                    // Keep initially copied nodes in clipboard
                    if (clipboard.type !== 'copy') {

                        // Clear clipboard
                        this.$store.commit('clipboard/clear');
                    }
                }
                this.open = false;
            },

            setColor(color) {
                this.$store.commit('nodes/changeColor', {nodes: this.nodes, color});
            }

        },

        mounted() {

            // Close via escape key
            window.addEventListener('keyup', e => e.key === 'Escape' && (this.open = false));

            // Function to check, if menu is open, if the user has clicked
            // outside of the menu. Only active is menu is visible.
            const detectOutsideClick = evt => {
                if (!this.eventPath(evt).includes(this.$refs.menuRoot)) {
                    this.open = false;
                }
            };

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

                // Set listener for out-of-bounds clicks
                window.addEventListener('mousedown', detectOutsideClick);

                // Set postion
                this.style.left = `${evt.clientX + 5}px`;
                this.style.top = `${evt.clientY + 5}px`;
                this.open = true;
            });

            // Event to hide the menu
            this.$on('hide', () => {
                window.removeEventListener('mousedown', detectOutsideClick);
                this.open = false;
            });
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

        &:empty {
            display: none;
        }

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
            margin: 0.25em 0;

            .name {
                @include font(600, 0.9em);
                margin-left: 0.75em;
            }

            &:hover {
                color: $palette-cloud-blue;
            }

            &.delete:hover {
                color: $palette-tomatoe-red;
            }

            &.sub {
                position: relative;

                .name {
                    @include flex(row, center);

                    i {
                        margin-left: 0.5em;
                    }
                }

                .sub-menu {
                    position: absolute;
                    transform: translateX(-10px);
                    left: 120%;
                    box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.1);
                    background: white;
                    padding: 1em;
                    visibility: hidden;
                    opacity: 0;
                    transition: transform 0.3s, opacity 0.3s, visibility 0.3s 0s;
                    cursor: default;
                }

                &:hover .sub-menu {
                    opacity: 1;
                    transform: none;
                    visibility: visible;
                }

                .sub-menu.colors {
                    display: grid;
                    grid-template-columns: repeat(5, 1fr);
                    grid-gap: 5px;

                    .color {
                        @include size(20px);
                        border: 1px solid rgba(black, 0.1);
                        border-radius: 100%;
                        cursor: pointer;
                        transition: all 1s;

                        &:hover {
                            filter: brightness(1.2);
                        }
                    }
                }
            }
        }
    }

</style>
