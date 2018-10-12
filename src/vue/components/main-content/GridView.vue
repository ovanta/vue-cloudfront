<template>
    <section class="grid-view">


        <h1 v-if="nodes.folder.length">Folders</h1>

        <!-- Folders and files -->
        <div class="grid-container">
            <div v-for="node of nodes.folder"
                 :class="{folder: 1, selected: selected.includes(node)}"
                 @dblclick="updateLocation(node.hash)"
                 @click="select($event, node)">

                <i class="material-icons" :style="{color: node.color}">folder</i>
                <span class="name">{{ node.name }}</span>
            </div>
        </div>

        <h1 v-if="nodes.file.length">Files</h1>

        <div class="grid-container">
            <div v-for="node of nodes.file"
                 :class="{file: 1, selected: selected.includes(node)}"
                 @click="select($event, node)">

                <i class="material-icons">insert_drive_file</i>
                <span class="name">{{ node.name }}</span>
            </div>
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
            return {
                selected: []
            };
        },

        methods: {

            updateLocation(hash) {
                this.$store.commit('location/update', hash);
                this.selected.splice(0, this.selected.length - 1);
            },

            select(e, node) {
                const idx = this.selected.indexOf(node);
                if (!~idx) {

                    // Check if user select multiple elements via ctrl key
                    if (e.ctrlKey) {
                        this.selected.push(node);
                    } else {
                        this.selected.splice(0, this.selected.length, node);
                    }

                } else {
                    this.selected.splice(idx, 1);
                }
            }

        }

    };

</script>

<style lang="scss" scoped>

    h1 {
        font-size: 1em;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.08);
        padding: 0.8em 0 0.2em;
        margin-bottom: 0.75em;
        font-weight: 400;
        color: $palette-deep-blue;
    }

    .grid-container {
        @include flex(row, flex-start);
        flex-wrap: wrap;
    }

    .folder,
    .file {
        position: relative;
        @include flex(row, center);
        padding: 0.5em 0.9em;
        margin: 0.5em 0.5em 0 0;
        border-radius: 0.15em;
        border: 1px solid rgba($palette-deep-blue, 0.08);
        transition: all 0.3s;
        cursor: pointer;
        font-size: 0.8em;

        i {
            color: $palette-grayish-blue;
            transition: all 0.3s;
        }

        &.selected {
            background: rgba($palette-cloud-blue, 0.05);
            border-color: rgba($palette-cloud-blue, 0.5);

            .name,
            .detail,
            i {
                color: $palette-cloud-blue;
            }
        }

        .name,
        .detail {
            color: $palette-deep-blue;
        }

        .name {
            width: 100%;
            margin-left: 0.5em;
            font-weight: 600;
        }
    }
</style>
