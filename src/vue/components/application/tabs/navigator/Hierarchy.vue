<template>
    <section class="hierarchy">

        <!-- Default display of the current folder hierarchy -->
        <div v-if="!searchResult && !markedNodes" class="nodes">
            <div v-for="(node, index) of nodes"
                 class="node">
                <span class="name" @click="updateLocation(node)">{{ node.name }}</span>
                <i v-if="index < nodes.length - 1" class="fas fa-fw fa-angle-right"></i>
            </div>
        </div>

        <!-- Human readable representation of the search result (if a search is currently performed) -->
        <div v-if="searchResult" class="amount-info">
            <b v-if="searchResult.file">{{ searchResult.file }} file{{ searchResult.file === 1 ? '' : 's' }}</b>
            <span v-if="searchResult.file && searchResult.folder"> and </span>
            <b v-if="searchResult.folder">{{ searchResult.folder }} folder{{ searchResult.folder === 1 ? '' : 's' }}</b>
            <span v-if="searchResult.file || searchResult.folder"> found</span>
            <span v-if="!searchResult.file && !searchResult.folder">Nothing found</span>
        </div>

        <!-- Same as search info, but for marked nodes -->
        <div v-if="markedNodes && !searchResult" class="amount-info">
            <b v-if="markedNodes.file">{{ markedNodes.file }} file{{ markedNodes.file === 1 ? '' : 's' }}</b>
            <span v-if="markedNodes.file && markedNodes.folder"> and </span>
            <b v-if="markedNodes.folder">{{ markedNodes.folder }} folder{{ markedNodes.folder === 1 ? '' : 's' }}</b>
            <span v-if="markedNodes.file || markedNodes.folder"> marked</span>
            <span v-if="!markedNodes.file && !markedNodes.folder">Nothing marked</span>
        </div>

    </section>
</template>

<script>

    export default {

        data() {
            return {};
        },

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

            markedNodes() {

                if (this.$store.state.activeTab !== 'marked') {
                    return null;
                }

                const nodes = this.$store.getters['nodes/currentDisplayedNodes']();
                return {
                    file: nodes.file.length,
                    folder: nodes.folder.length
                };
            }

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
        flex-wrap: wrap;
        min-height: 2.5em;

        .node {
            @include inline-flex(row, center);
            @include font(600, 0.8em);
            color: rgba($palette-deep-blue, 0.8);
            margin-bottom: 0.5em;

            .name {
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.3em 0.75em 0.4em;
                border-radius: 50em;
                background: white;
                box-shadow: 0 1px 5px 0 darken(white, 5);
                max-width: 7em;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;

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
