<template>
    <div class="group-statistics">

        <h1>
            <i class="fas fa-fw fa-layer-group"></i>
            <span>Current state</span>
        </h1>

        <div class="groups">
            <p v-for="{name, value} of stats">
                <span>{{ name }}: </span> <b>{{ value || 'None' }}</b>
            </p>
        </div>

    </div>
</template>

<script>

    export default {

        data() {
            return {};
        },

        computed: {

            stats() {
                const {nodes} = this.$store.state;
                const totalNodes = nodes.length;
                let starredFiles = 0;
                let starredFolders = 0;
                let binFiles = 0;
                let binFolders = 0;

                for (let i = 0, l = nodes.length; i < l; i++) {
                    const node = nodes[i];

                    if (node.marked) {
                        if (node.type === 'dir') {
                            starredFolders++;
                        } else if (node.type === 'file') {
                            starredFiles++;
                        }
                    } else if (node.bin) {
                        if (node.type === 'dir') {
                            binFolders++;
                        } else if (node.type === 'file') {
                            binFiles++;
                        }
                    }
                }

                return [
                    {name: 'Total files and folders', value: totalNodes},
                    {name: 'Starred files', value: starredFiles},
                    {name: 'Starred folders', value: starredFolders},
                    {name: 'Files moved to bin', value: binFiles},
                    {name: 'Folders moved to bin', value: binFolders}
                ];
            }
        }
    };

</script>

<style lang="scss" scoped>

    .groups {
        color: $palette-asphalt;
        margin-left: 0.5em;
        font-size: 0.9em;

        p {
            margin: 0.25em 0;
        }
    }

</style>
