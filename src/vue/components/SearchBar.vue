<template>
    <section class="search-bar" @blur="showFilter = false">

        <!-- Search-bar with filter functions -->
        <div class="search-field">
            <input type="text" placeholder="Search all files" spellcheck="false" v-model="searchQuery" @input="updateSearch()">
            <i :class="{'material-icons': 1, visible: searchQuery.length}" @click="clear">clear</i>
        </div>

    </section>
</template>

<script>
    export default {

        data() {
            return {
                searchQuery: '',
                storeUnsubscription: null
            };
        },

        methods: {

            updateSearch() {
                this.$store.dispatch('search/update', this.searchQuery);
            },

            clear() {
                this.searchQuery = '';
                this.updateSearch();
            }
        },

        mounted() {

            // Listen for node-changes
            this.storeUnsubscription = this.$store.subscribe(mutation => {

                // No need to do something if no search is performed
                if (!this.searchQuery) {
                    return;
                }

                // Update search on changes
                if (mutation.type.startsWith('nodes')) {
                    this.updateSearch();
                }

                // Clear search on location change
                if (mutation.type.startsWith('location')) {
                    this.clear();
                }
            });
        },

        destroyed() {
            if (this.storeUnsubscription) {
                this.storeUnsubscription();
            }
        }

    };
</script>


<style lang="scss" scoped>

    .search-field {
        position: relative;
        @include flex(row, center);
        padding: 0.25em 0.1em;
        margin-bottom: 0.75em;
        border-bottom: 1px solid rgba($palette-grayish-blue, 0.2);

        input {
            flex-grow: 1;
            font-weight: 600;
            color: $palette-grayish-blue;

            &::placeholder {
                color: rgba($palette-grayish-blue, 0.5);
            }
        }

        i {
            color: $palette-grayish-blue;
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0s 0s;

            &.visible {
                visibility: visible;
                opacity: 1;
            }
        }
    }

</style>
