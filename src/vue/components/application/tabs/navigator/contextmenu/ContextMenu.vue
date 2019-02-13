<template>
    <div ref="menu"
         :class="{menu: 1, open}"
         :style="style">

        <div v-if="search.active && nodes.length === 1"
             class="option"
             @click="jump">
            <i class="fas fa-fw fa-compass"></i>
            <span class="name">Locate</span>
        </div>

        <div v-if="marked || type === 'files' || type === 'dir' || type === 'mixed'"
             class="option star"
             @click="star">
            <i :class="`fa${ marked === 2 ? 'r' : 's'} fa-fw fa-bookmark`"></i>
            <span class="name">{{ marked === 2 ? 'Remove mark' : 'Add mark' }}</span>
        </div>

        <div v-if="type === 'files' || type === 'dir' || type === 'mixed'"
             class="option delete"
             @click="del">
            <i class="fas fa-fw fa-trash-alt"></i>
            <span class="name">{{ deleted ? 'Delete forever' : 'Remove' }}</span>
        </div>

        <div v-if="deleted"
             class="option"
             @click="restore">
            <i class="fas fa-fw fa-redo"></i>
            <span class="name">Restore</span>
        </div>

        <div v-if="nodes.length === 1"
             class="option"
             @click="download">
            <i class="fas fa-fw fa-download"></i>
            <span class="name">Download</span>
        </div>

        <div v-if="!search.active && activeTab === 'home'"
             class="option"
             @click="newFolder">
            <i class="fas fa-fw fa-folder-plus"></i>
            <span class="name">New Folder</span>
        </div>

        <div v-if="nodes.length === 1"
             class="option"
             @click="edit">
            <i class="fas fa-fw fa-pen"></i>
            <span class="name">Rename</span>
        </div>

        <div v-if="nodes.length && activeTab === 'home'"
             class="option"
             @click="moveToClipboard('copy')">
            <i class="fas fa-fw fa-copy"></i>
            <span class="name">Copy</span>
        </div>

        <div v-if="nodes.length && activeTab === 'home'"
             class="option"
             @click="moveToClipboard('move')">
            <i class="fas fa-fw fa-cut"></i>
            <span class="name">Cut</span>
        </div>

        <div v-if="clipboard.nodes.length && activeTab === 'home'"
             class="option"
             @click="execClipboardAction">
            <i class="fas fa-fw fa-paste"></i>
            <span class="name">Paste</span>
        </div>

        <div v-if="nodes.length && activeTab === 'home'"
             class="option"
             @click="zip">
            <i class="fas fa-fw fa-file-archive"></i>
            <span class="name">Zip it</span>
        </div>

        <div v-if="nodes.length === 1"
             class="option"
             @click="share">
            <i class="fas fa-fw fa-share-alt"></i>
            <span class="name">Share</span>
        </div>

        <div v-if="type === 'dir'" class="option sub">
            <i class="fas fa-fw fa-palette"></i>
            <span class="name">Change color</span>
            <color-chooser class="sub-menu" @change="setColor"/>
        </div>

    </div>
</template>

<script>

    // Components
    import ColorChooser from './ColorChooser';

    // Vue stuff
    import {mapState} from 'vuex';

    export default {

        components: {ColorChooser},

        data() {
            return {
                open: false,
                type: '',
                nodes: [],
                style: {}
            };
        },

        computed: {

            marked() {
                if (!this.nodes.length) {
                    return 0;
                }

                const amount = this.nodes.filter(v => v.marked).length;
                if (amount === this.nodes.length) {
                    return 2;
                } else if (amount) {
                    return 1;
                } else {
                    return 0;
                }
            },

            deleted() {
                return this.nodes.find(v => v.bin) ? 1 : 0;
            },

            activeTab() {
                return this.$store.state.activeTab;
            },

            ...mapState(['search', 'clipboard'])
        },

        updated() {

            // Check if sub menus are clipped
            requestAnimationFrame(() => {
                const subMenus = this.$refs.menu.querySelectorAll('.sub-menu');
                for (const sub of subMenus) {
                    const subbcr = sub.getBoundingClientRect();
                    if (subbcr.right > window.innerWidth) {
                        sub.classList.add('left');
                    } else if (subbcr.left < 0) {
                        sub.classList.remove('left');
                    }
                }
            });

            requestAnimationFrame(() => {
                const {menu} = this.$refs;
                const bcr = menu.getBoundingClientRect();
                if (bcr.bottom > window.innerHeight) {
                    menu.classList.add('top');
                } else {
                    menu.classList.remove('top');
                }
            });
        },

        mounted() {

            // Close on resize and keypress
            this.utils.on(window, ['resize', 'keydown', 'wheel', 'blur'], () => this.$emit('hide'));

            // Function to check, if menu is open, if the user has clicked
            // outside of the menu. Only active is menu is visible.
            const detectOutsideClick = evt => {
                if (!this.utils.eventPath(evt).includes(this.$refs.menu)) {
                    this.$emit('hide');
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
                const hasFolder = this.nodes.find(n => n.type === 'dir');

                // Check which nodes are present / currently selected
                if (hasFiles && hasFolder) {
                    this.type = 'mixed';
                } else if (hasFiles) {
                    this.type = 'files';
                } else if (hasFolder) {
                    this.type = 'dir';
                } else {
                    this.type = 'none';
                }

                // Set listener for out-of-bounds clicks
                this.utils.on(window, ['mousedown', 'touchstart'], detectOutsideClick);

                // Set postion
                const tap = (evt.touches && evt.touches[0] || evt);
                this.style.left = `${tap.clientX + 5}px`;
                this.style.top = `${tap.clientY + 5}px`;
                this.open = true;
            });

            // Event to hide the menu
            this.$on('hide', () => {
                this.utils.off(window, ['mousedown', 'touchstart'], detectOutsideClick);
                this.open = false;
            });
        },

        methods: {

            jump() {
                const {nodes} = this.$store.state;
                const parentId = this.nodes[0].parent;

                for (let i = 0, n = nodes.length; i < n; i++) {
                    if (nodes[i].id === parentId) {
                        this.$store.commit('location/update', nodes[i]);
                        break;
                    }
                }

                this.$emit('hide');
            },

            zip(){
                this.$store.dispatch('nodes/zip', {nodes: this.nodes});
                this.$emit('hide');
            },

            del() {
                this.$store.dispatch('nodes/delete', {nodes: this.nodes});
                this.$emit('hide');
            },

            restore() {
                this.$store.dispatch('nodes/restore', this.nodes);
                this.$emit('hide');
            },

            star() {
                this.$store.dispatch(`nodes/${this.marked === 2 ? 'remove' : 'add'}Mark`, this.nodes);
                this.$emit('hide');
            },

            edit() {
                this.$store.commit('editable/set', this.nodes[0]);
                this.$emit('hide');
            },

            download() {
                this.$store.dispatch('data/download', {node: this.nodes[0]});
                this.$emit('hide');
            },

            newFolder() {

                // Create a folder and immediatly make it editable
                this.$store.dispatch('nodes/createFolder', {parent: this.$store.state.location.node}).then(folderNode => {
                    this.$store.commit('editable/set', folderNode);
                });

                this.$emit('hide');
            },

            moveToClipboard(type) {
                if (this.nodes.length) {

                    // Save to clipboard
                    this.$store.commit('clipboard/insert', {
                        nodes: this.nodes,
                        type
                    });
                }
                this.$emit('hide');
            },

            execClipboardAction() {
                const {clipboard, location} = this.$store.state;
                const clipboardNodes = clipboard.nodes;
                if (clipboardNodes.length) {

                    // Move elements
                    this.$store.dispatch(`nodes/${clipboard.type}`, {
                        nodes: clipboardNodes,
                        destination: location.node
                    });

                    // Keep initially copied nodes in clipboard
                    if (clipboard.type !== 'copy') {

                        // Clear clipboard
                        this.$store.commit('clipboard/clear');
                    }
                }
                this.$emit('hide');
            },

            setColor(color) {
                this.$store.dispatch('nodes/changeColor', {nodes: this.nodes, color});
            },

            share() {
                if (this.nodes.length === 1) {
                    this.$store.commit('setActivePopup', 'ShareViaLink');
                    this.$store.commit('share/set', this.nodes[0]);
                    this.$emit('hide');
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .menu {
        @include flex(column);
        position: fixed;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s;
        background: white;
        padding: 0.4em 0.25em;
        box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.2);
        border-radius: 0.5em;

        &:empty {
            display: none;
        }

        &.open {
            opacity: 1;
            pointer-events: all;
        }

        &.top {
            transform: translateY(-100%);
        }

        .option {
            @include flex(row, center);
            padding: 0.35em 1em;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.3s;
            color: $palette-deep-blue;
            margin: 0.25em 0;

            i {
                font-size: 1.15em;
            }

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
                    width: 100%;

                    i {
                        margin-left: auto;
                        padding-left: 0.75em;
                    }
                }

                .sub-menu {
                    position: absolute;
                    transform: translateY(-10px) rotateX(15deg) perspective(100px);
                    left: 105%;
                    bottom: -200%;
                    box-shadow: 0 3px 15px 0 rgba(0, 0, 0, 0.1);
                    background: white;
                    padding: 1em;
                    pointer-events: none;
                    opacity: 0;
                    transition: all 0.3s;
                    cursor: default;
                    border-radius: 0.25em;

                    &.left {
                        left: auto;
                        right: 105%;
                    }

                    // To fill the gap between the menu and the sub-menu
                    &::before {
                        @include pseudo();
                        @include position(-10%, -10%, auto, auto);
                        @include size(120%, 120%);
                        background: transparent;
                        z-index: -1;
                    }
                }

                &:hover .sub-menu {
                    opacity: 1;
                    transform: perspective(100px);
                    pointer-events: all;
                }
            }
        }
    }

</style>
