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

        <div class="option">
            <i class="material-icons">create_new_folder</i>
            <span class="name">New Folder</span>
        </div>

        <div class="option" v-if="nodes.length === 1" @click="edit()">
            <i class="material-icons">edit</i>
            <span class="name">Rename</span>
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
            this.$on('show', (evt, nodes) => {
                this.nodes = nodes;
                const hasFiles = nodes.find(n => n.type === 'file');
                const hasFolder = nodes.find(n => n.type === 'folder');

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
            color: $palette-deep-blue;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.3s;

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
