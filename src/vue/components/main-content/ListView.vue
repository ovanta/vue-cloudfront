<template>
    <section class="list-view">

        <!-- Table header -->
        <div class="header">
            <i class="material-icons" style="opacity: 0">folder</i>
            <span class="name">Name</span>
            <span class="detail">Last modified</span>
            <span class="detail">Size</span>
        </div>


        <!-- Folders and files -->
        <div v-for="node of nodes.folder" class="selectable folder"
             @dblclick="updateLocation(node.hash)"
             :data-hash="node.hash">

            <i class="material-icons" :style="{color: node.color}">folder</i>
            <span class="name" :contenteditable="node.editable" spellcheck="false" @keydown.enter.prevent="renameNode($event, node)" v-select-all="node.editable">{{ node.name }}</span>
            <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
            <span class="detail">{{ node.size | readableByteCount }}</span>
        </div>

        <div v-for="node of nodes.file"
             class="selectable file"
             :data-hash="node.hash">

            <i class="material-icons">insert_drive_file</i>
            <span class="name" :contenteditable="node.editable" spellcheck="false" @keydown.enter.prevent="renameNode($event, node)" v-select-all="node.editable">{{ node.name }}</span>
            <span class="detail">{{ node.lastModified | readableTimestamp }}</span>
            <span class="detail">{{ node.size | readableByteCount }}</span>
        </div>


    </section>
</template>


<script>

    export default {

        computed: {

            nodes() {
                const loc = this.$store.state.location;
                const locHash = loc[loc.length - 1];
                const nodes = {file: [], folder: []}; // Seperate files and folders

                // Find folder and files which has the current locations as parent
                this.$store.state.nodes.forEach(n => {

                    // Check if parent is the current location
                    if (n.parent === locHash) {
                        nodes[n.type].push(n);
                    }
                });

                const calcFolderSize = (hash) => {
                    return this.$store.state.nodes.filter(v => v.parent === hash).reduce((size, val) => (
                        size + (val.type === 'folder' ? calcFolderSize(val.hash) : val.size)
                    ), 0);
                };

                // Calculate recursivly the size of each folder
                for (const folder of nodes.folder) {
                    folder.size = calcFolderSize(folder.hash);
                }

                return nodes;
            }

        },

        data() {
            return {};
        },

        methods: {

            updateLocation(hash) {
                this.$store.commit('location/update', hash);
            },

            renameNode(evt, node) {
                node.editable = false;
                this.$store.commit('nodes/rename', {
                    node,
                    newName: evt.target.innerHTML
                });
            }

        }

    };

</script>

<style lang="scss" scoped>

    .folder,
    .file,
    .header {
        @include flex(row, center);
        user-select: none;
        padding: 0.4em 0;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.08);
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.8em;

        i {
            color: $palette-deep-blue;
            transition: all 0.3s;
        }

        &.selected {

            .name,
            .detail,
            i {
                color: $palette-cloud-blue;
            }
        }

        .name,
        .detail {
            color: $palette-deep-blue;
            transition: all 0.3s;
        }

        .name {
            width: 100%;
            margin: 0 0.5em;
            padding: 0.15em 0 0.15em 0.25em;
            font-weight: 600;
            border-bottom: 2px solid transparent;
            transition: all 0.3s;

            &[contenteditable=true] {
                border-color: $palette-cloud-blue;
                cursor: text;
                outline: none;
            }
        }

        .detail {
            width: 60%;
            opacity: 0.8;
        }

        &:nth-last-child(1) {
            border-bottom: none;
        }
    }

    .header {
        font-weight: 600;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.2);
    }

</style>
