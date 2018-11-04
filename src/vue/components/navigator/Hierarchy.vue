<template>
    <section class="hierarchy">

        <!-- Default display of the current folder hierarchy -->
        <div class="node" v-for="(node, index) of nodes" v-if="!searchResult && !starredNodes">
            <span class="name" @click="updateLocation(node)">{{ node.name }}</span>
            <i class="fas fa-fw fa-angle-right" v-if="index < nodes.length - 1"></i>
        </div>


        <!-- Human readable representation of the search result (if a search is currently performed) -->
        <div class="amount-info" v-if="searchResult">
            <b v-if="searchResult.file">{{ searchResult.file }} files</b>
            <span v-if="searchResult.file && searchResult.folder"> and </span>
            <b v-if="searchResult.folder">{{ searchResult.folder }} folders</b>
            <span v-if="searchResult.file || searchResult.folder"> found</span>
            <span v-if="!searchResult.file && !searchResult.folder">Nothing here</span>
        </div>


        <!-- Same as search info, but for starred nodes -->
        <div class="amount-info" v-if="starredNodes && !searchResult">
            <b v-if="starredNodes.file">{{ starredNodes.file }} files</b>
            <span v-if="starredNodes.file && starredNodes.folder"> and </span>
            <b v-if="starredNodes.folder">{{ starredNodes.folder }} folders</b>
            <span v-if="starredNodes.file || starredNodes.folder"> starred</span>
            <span v-if="!starredNodes.file && !starredNodes.folder">Nothing starred</span>
        </div>

    </section>
</template>

<script>

    export default {

        computed: {

            nodes() {
                return this.$store.getters['location/getHierarchy'];
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
            },

            starredNodes() {

                if (!this.$store.state.showStarredNodes) {
                    return null;
                }

                const nodes = this.$store.getters['nodes/currentDisplayedNodes']();
                return {
                    file: nodes.file.length,
                    folder: nodes.folder.length
                };
            }

        },

        data() {
            return {};
        },

        methods: {
            updateLocation(node) {
                this.$store.commit('location/update', node);
            }
        }

    };

</script>

<style lang="scss" scoped>

    .hierarchy {
        @include flex(row, center);

        .node {
            @include inline-flex(row, center);
            @include font(600, 0.8em);
            color: rgba($palette-deep-blue, 0.8);

            .name {
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.3em 0.75em 0.3em;
                border-radius: 50em;
                background: white;
                box-shadow: 0 1px 5px 0 darken(white, 5);

                &:hover {
                    color: rgba($palette-deep-blue, 0.9);
                    box-shadow: 0 1px 5px 0 darken(white, 10);
                }
            }

            i {
                color: rgba($palette-deep-blue, 0.25);
                opacity: 0.5;
                margin: 0 0.5em;
            }

            &:last-child .name {
                background: $palette-deep-purple;
                box-shadow: 0 2px 10px 0 rgba($palette-deep-purple, 0.5);
                color: white;
            }
        }
    }

    .amount-info {
        color: $palette-deep-blue;
        font-size: 0.9em;
    }

</style>
