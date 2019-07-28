<template>
    <div class="group-statistics">

        <h1>
            <i class="fas fa-fw fa-layer-group"></i>
            <span>Current state</span>
        </h1>

        <div class="groups">
            <p v-for="{name, value} of stats"
               :key="name">
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
                const starredFiles = [];
                const starredFolders = [];
                const binFiles = [];
                const binFolders = [];
                const sharedFiles = [];

                for (const node of nodes) {
                    if (node.type === 'dir') {
                        node.marked && starredFolders.push(node);
                        node.bin && binFolders.push(node);
                    } else if (node.type === 'file') {
                        node.marked && starredFiles.push(node);
                        node.bin && binFiles.push(node);
                        node.staticIds.length && sharedFiles.push(node);
                    }
                }

                return [
                    {name: 'Total files and folders', value: {length: totalNodes}},
                    {name: 'Starred files', value: starredFiles},
                    {name: 'Starred folders', value: starredFolders},
                    {name: 'Files moved to bin', value: binFiles},
                    {name: 'Folders moved to bin', value: binFolders},
                    {name: 'Shared files', value: sharedFiles}
                ].map(({name, value}) => {
                    value = value.length === 1 ? value[0].name : value.length;
                    return {value, name};
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .groups {
        color: RGB(var(--primary-text-color));
        margin-left: 0.5em;
        font-size: 0.9em;

        p {
            margin: 0.25em 0;
        }
    }

</style>
