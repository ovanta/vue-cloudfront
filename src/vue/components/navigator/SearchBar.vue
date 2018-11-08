<template>
    <section class="search-bar" @blur="showFilter = false">

        <!-- Search-bar with filter functions -->
        <div class="search-field">

            <i class="fas fa-search"></i>
            <input type="text" placeholder="Search..." spellcheck="false" v-model="searchQuery" @input="updateSearch()">
            <i :class="{delete: 1, 'fas fa-times': 1, visible: searchQuery.length}" @click="clear"></i>

            <!-- Show available filters -->
            <i class="fas fa-fw fa-filter" @click="$store.commit('setActivePopup', 'SearchFilters')"></i>
        </div>

        <!-- Options -->
        <div class="options">

            <div class="option">
                <multi-switch-button :active="0" :options="['All', 'File', 'Folder']" @change="setTypeOption"></multi-switch-button>
            </div>

            <div class="option">
                <simple-button text="Regex" @change="setRegexOption"></simple-button>
            </div>

            <div class="option">
                <simple-button text="Case insensitiv" @change="setCaseInsensitivOption"></simple-button>
            </div>

            <!-- Introduction -->
            <intro-box header="Search Options" text="Filter by type, use regular expressions or ignore case."></intro-box>
        </div>
    </section>
</template>

<script>

    // UI Components
    import MultiSwitchButton from '../../ui/MultiSwitchButton';
    import SimpleButton from '../../ui/SimpleButton';

    export default {

        components: {
            SimpleButton,
            MultiSwitchButton
        },

        data() {
            return {
                searchQuery: ''
            };
        },

        methods: {

            updateSearch() {
                this.$store.dispatch('search/update', this.searchQuery);
            },

            clear() {
                this.searchQuery = '';
                this.updateSearch();
            },

            setRegexOption(state) {
                this.$store.commit('search/setOption', {
                    key: 'regex',
                    value: state
                });
                this.updateSearch();
            },

            setCaseInsensitivOption(state) {
                this.$store.commit('search/setOption', {
                    key: 'ignoreCase',
                    value: state
                });
                this.updateSearch();
            },

            setTypeOption(state) {
                this.$store.commit('search/setOption', {
                    key: 'type',
                    value: state.toLowerCase()
                });
                this.updateSearch();
            }
        },

        mounted() {
            this.$callOnDestroy(

                // If nodes getting deleted / added update search.
                this.$store.watch(state => state.nodes, () => this.updateSearch()),

                this.$store.subscribe(mutation => {

                    // No need to do something if no search is performed
                    if (!this.searchQuery) {
                        return;
                    }

                    // Clear search if location changes
                    if (mutation.type.startsWith('location')) {
                        this.clear();
                    }
                })
            );
        }

    };
</script>


<style lang="scss" scoped>

    .search-bar {
        position: relative;
        padding: 1em;
        background: #fff;
        box-shadow: 0 0 3px 0 rgba($palette-deep-blue, 0.05);
    }

    .search-field {
        @include flex(row, center);
        padding: 0.5em 0.1em;
        border-radius: 50em;
        margin-bottom: 0.5em;

        &:focus-within {
            i {
                color: $palette-deep-purple;
            }
        }

        input {
            @include font(400, 0.85em);
            color: $palette-deep-blue;
            flex-grow: 1;

            &::placeholder {
                color: $palette-decent-blue;
            }
        }

        i {
            color: $palette-decent-blue;
            padding: 0 0.6em;
            font-size: 1em;
            transition: all 0.5s;

            &.delete {
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transform: rotate(90deg);
                transition: all 0.3s;

                &.visible {
                    visibility: visible;
                    transform: none;
                    opacity: 1;
                }

                &:hover {
                    color: $palette-tomatoe-red;
                }
            }
        }

        .fa-filter {
            cursor: pointer;
            margin-right: 0.5em;
            transition: all 0.5s;

            &:hover {
                color: $palette-deep-purple;
            }
        }
    }

    .options {
        position: relative;
        @include inline-flex(row, stretch);
        margin: 0 0.75em 0.5em 0.75em;

        .option {
            @include flex(row, center);
            margin-right: 0.5em;
        }
    }

</style>
