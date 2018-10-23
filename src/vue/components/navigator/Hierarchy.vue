<template>
    <section class="hierarchy">

        <div class="node" v-for="(node, index) of nodes" v-if="!searchResult">
            <span class="name" @click="updateLocation(node.hash)">{{ node.name }}</span>
            <i class="material-icons" v-if="index < nodes.length - 1">arrow_right</i>
        </div>

        <div class="search-info" v-if="searchResult">
            <b v-if="searchResult.file">{{ searchResult.file }} files</b>
            <span v-if="searchResult.file && searchResult.folder"> and </span>
            <b v-if="searchResult.folder">{{ searchResult.folder }} folders</b>
            <span v-if="searchResult.file || searchResult.folder"> found</span>
            <span v-if="!searchResult.file && !searchResult.folder">Nothing here</span>
        </div>

    </section>
</template>

<script>

    export default {

        computed: {

            nodes() {
                const nodes = this.$store.state.nodes;
                const loc = this.$store.state.location;
                const res = new Array(loc.length);

                // Resolve nodes in current hierarchy
                let index;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {
                    if (n.type === 'folder' && ~(index = loc.indexOf(n.hash))) {
                        res[index] = n;
                    }
                }

                return res;
            },

            searchResult() {
                const search = this.$store.state.search;

                if (!search.active) {
                    return null;
                }

                // Calculate number of files / folders
                const res = {folder: 0, file: 0};
                const nodes = search.nodes;
                const nodesAmount = nodes.length;
                for (let i = 0, n; n = nodes[i], i < nodesAmount; i++) {
                    res[n.type]++;
                }

                return res;
            }

        },

        data() {
            return {};
        },

        methods: {
            updateLocation(hash) {
                this.$store.commit('location/update', hash);
            }
        }

    };

</script>

<style lang="scss" scoped>

    .hierarchy {
        @include flex(row, center);

        .node {
            @include inline-flex(row, center);
            color: $palette-deep-blue;
            font-size: 0.9em;

            .name {
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.2em 0.65em;
                border-radius: 0.25em;
                background: $palette-grayish-blue-transparent;

                &:hover {
                    background: $palette-grayish-blue-transparent-dark;
                }
            }

            i {
                color: rgba(black, 0.25);
                opacity: 0.5;
            }

            &:last-child .name {
                background: $palette-cloud-blue;
                color: white;
            }
        }
    }

    .search-info {
        color: $palette-deep-blue;
        font-size: 0.9em;
    }

</style>
