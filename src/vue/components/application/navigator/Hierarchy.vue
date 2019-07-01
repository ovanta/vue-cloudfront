<template>
    <section class="hierarchy">

        <!-- Default display of the current folder hierarchy -->
        <div v-if="!searchResult && !simpleCount" class="nodes">
            <div v-for="(node, index) of nodes"
                 :data-hash="node.id"
                 class="node">

                <span :style="{'--color': index === nodes.length - 1 ? node.colorVariable : 'inherit'}"
                      class="name"
                      @click="updateLocation(node)">{{ node.name }}</span>

                <i v-if="index < nodes.length - 1" class="fas fa-fw fa-angle-right"></i>
            </div>
        </div>

        <!-- Human readable representation of the search result (if a search is currently performed) -->
        <div v-if="searchResult" class="amount-info search">
            <b v-if="searchResult.file">{{ searchResult.file }} file{{ searchResult.file === 1 ? '' : 's' }}</b>
            <span v-if="searchResult.file && searchResult.dir"> and </span>
            <b v-if="searchResult.dir">{{ searchResult.dir }} folder{{ searchResult.dir === 1 ? '' : 's' }}</b>
            <span v-if="searchResult.file || searchResult.dir"> found</span>
            <span v-if="!searchResult.file && !searchResult.dir">Nothing found</span>
            <span v-if="search.query"> for <b>{{ search.query }}</b></span>

            <div class="filters">
                <span v-for="filter of search.filters">{{ filter }}</span>
            </div>
        </div>

        <!-- Same as search info, but for marked nodes and nodes which are currently in the bin -->
        <div v-if="simpleCount && !searchResult" class="amount-info">
            <b v-if="simpleCount.file">{{ simpleCount.file }} file{{ simpleCount.file === 1 ? '' : 's' }} </b>
            <span v-if="simpleCount.file && simpleCount.dir">and </span>
            <b v-if="simpleCount.dir">{{ simpleCount.dir }} folder{{ simpleCount.dir === 1 ? '' : 's' }} </b>

            <span v-if="simpleCount.file || simpleCount.dir">
                <span v-if="activeTab === 'bin'">moved to the bin</span>
                <span v-else-if="activeTab === 'marked'">starred</span>
            </span>

            <span v-if="!simpleCount.file && !simpleCount.dir">
                <span v-if="activeTab === 'bin'">Nothing deleted yet</span>
                <span v-else-if="activeTab === 'marked'">Nothing starred</span>
            </span>
        </div>

    </section>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            return {};
        },

        computed: {
            ...mapState(['activeTab', 'search']),

            nodes() {
                return this.$store.getters['location/getHierarchy'].map(v => {

                    // Create shallow copy
                    v = {...v};

                    // Convert to a rgb string which can be used as part of rgba()
                    const [, r, g, b] = v.color.match(/#(..)(..)(..)/);
                    v.colorVariable = `${parseInt(r, 16)}, ${parseInt(g, 16)}, ${parseInt(b, 16)}`;

                    return v;
                });
            },

            searchResult() {
                const search = this.search;

                if (!search.active) {
                    return null;
                }

                // Calculate number of files / folders
                const res = {dir: 0, file: 0};
                const nodes = search.nodes;
                const nodesAmount = nodes.length;
                for (let i = 0, n; n = nodes[i], i < nodesAmount; i++) {
                    res[n.type]++;
                }

                return res;
            },

            simpleCount() {

                if (!['marked', 'bin'].includes(this.activeTab)) {
                    return null;
                }

                const nodes = this.$store.getters['nodes/currentDisplayedNodes']();
                return {
                    file: nodes.file.length,
                    dir: nodes.dir.length
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
        min-height: 2.5em;

        .nodes {
            @include flex(row, center);
            flex-wrap: wrap;
        }

        .node {
            position: relative;
            @include inline-flex(row, center);
            @include font(600, 0.825em);
            color: RGBA(var(--primary-text-color), 0.8);
            margin-bottom: 0.5em;

            @include animate('0.3s') {
                from {
                    opacity: 0;
                    transform: translateY(-0.2em);
                }
                to {
                    opacity: 1;
                    transform: none;
                }
            }

            .name {
                @include white-space-overflow;
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.35em 0.5em 0.5em;
                max-width: 10em;
                border-radius: 0.25em;

                &:hover {
                    color: black;
                }

                &::after {
                    @include pseudo();
                    @include size(0);
                    @include position(0, 0, auto, 0);
                    margin: auto;
                    border: 4px solid transparent;
                    border-top-color: RGB(var(--cloud-blue));
                    opacity: 0;
                    transform: translateY(-0.25em);
                    transition: all 0.3s;
                }
            }

            i {
                color: RGBA(var(--primary-text-color), 0.25);
                opacity: 0.5;
                margin: 0 0.25em;
                font-size: 1.2em;
            }

            &:last-child .name {
                color: RGB(var(--color));

                &::before {
                    opacity: 1;
                    transform: none;
                }
            }

            &.droppable .name {
                color: RGB(var(--cloud-blue));

                &::after {
                    transform: none;
                    opacity: 1;
                }
            }
        }
    }

    .amount-info {
        @include flex(row, center);
        color: RGB(var(--primary-text-color));
        font-size: 0.9em;
        white-space: pre-wrap;

        @include animate('0.3s') {
            from {
                opacity: 0;
                transform: translateY(-0.3em);
            }
            to {
                opacity: 1;
                transform: none;
            }
        }

        &.search {
            display: block;

            .filters {
                @include flex(row, center);
                @include font(600, 0.75em);
                flex-wrap: wrap;
                margin-top: 1em;
                color: RGB(var(--secondary-background-color));

                > span {
                    margin: 0.25em 0.25em 0 0;
                    background: RGB(var(--primary-text-color));
                    padding: 0.15em 0.75em 0.35em;
                    border-radius: 0.15em;
                    box-shadow: 0 1px 2px RGBA(var(--primary-text-color), 0.15);
                }
            }
        }
    }

    @include mq-phones {
        .hierarchy {
            min-height: 0;
        }
    }

</style>
