<template>
    <section class="hierarchy">

        <div class="node" v-for="(node, index) of nodes" v-if="!searchResult">
            <span class="name" @click="updateLocation(node.hash)">{{ node.name }}</span>
            <i class="material-icons" v-if="index < nodes.length - 1">keyboard_arrow_right</i>
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
                return this.$store.state.location.map(
                    n => this.$store.state.nodes.find(sn => sn.hash === n)
                );
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
            color: rgba($palette-deep-blue, 0.8);

            .name {
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.2em 0.5em;
                border-radius: 0.1em;

                &:hover {
                    color: $palette-cloud-blue;
                }

            }

            i {
                opacity: 0.75;
            }

            &:first-child .name {
                padding-left: 0;
            }
        }
    }

    .search-info {
        color: $palette-deep-blue;
    }

</style>
