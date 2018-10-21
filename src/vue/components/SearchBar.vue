<template>
    <section class="search-bar" @blur="showFilter = false">

        <!-- Search-bar with filter functions -->
        <div class="search-field">
            <input type="text" placeholder="Search all files" spellcheck="false" v-model="searchQuery" @input="updateSearch()">
            <i :class="{'material-icons': 1, visible: searchQuery.length}" @click="clear">clear</i>
        </div>

        <!-- Options -->
        <div class="options">

            <div :class="{option: 1}">
                <multi-switch-button :active="0" :options="['All', 'File', 'Folder']" @change="setTypeOption"></multi-switch-button>
            </div>

            <div :class="{option: 1}">
                <simple-button text="Regex" @change="setRegexOption"></simple-button>
            </div>

        </div>

    </section>
</template>

<script>

    // UI Components
    import MultiSwitchButton from '../ui/MultiSwitchButton';
    import SimpleButton from '../ui/SimpleButton';

    export default {

        components: {
            SimpleButton,
            MultiSwitchButton
        },

        data() {
            return {
                searchQuery: '',

                // Search options
                options: {
                    regex: false,
                    type: 'all' // Can be folder / file or all
                },

                storeUnsubscription: null
            };
        },

        methods: {

            updateSearch() {
                this.$store.dispatch('search/update', {
                    query: this.searchQuery,
                    options: this.options
                });
            },

            clear() {
                this.searchQuery = '';
                this.updateSearch();
            },

            setRegexOption(state) {
                this.options.regex = state;
                this.updateSearch();
            },

            setTypeOption(state){
                this.options.type = state.toLowerCase();
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
        margin-bottom: 0.5em;
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

    .options {
        @include flex(row, stretch);
        margin-bottom: 0.5em;

        .option {
            @include flex(row, center);
            margin-right: 0.5em;
        }
    }

</style>
