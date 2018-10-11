<template>
    <section class="list-view">


        <div class="folder" v-for="node of nodes.folder" @dblclick="updateLocation(node.hash)">
            <i class="material-icons">folder</i>
            <span class="name">{{ node.name }}</span>
        </div>

        <div class="file" v-for="node of nodes.file">
            <i class="material-icons">insert_drive_file</i>
            <span class="name">{{ node.name }}</span>
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
            }
        }

    };

</script>

<style lang="scss" scoped>

    .folder,
    .file {
        @include flex(row, center);
        user-select: none;
        padding: 0.4em 0;
        border-bottom: 1px solid rgba($palette-deep-blue, 0.08);

        i {
            color: $palette-grayish-blue;
        }

        .name {
            width: 100%;
            color: $palette-deep-blue;
            margin-left: 0.5em;
        }

        &:nth-last-child(1) {
            border-bottom: none;
        }
    }

    .folder {
        cursor: pointer;
    }

</style>
