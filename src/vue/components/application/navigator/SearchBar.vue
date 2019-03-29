<template>
    <section class="search-bar" @blur="showFilter = false">

        <!-- Search-bar with filter functions -->
        <div class="search-field">

            <i class="fas fa-search"></i>
            <input v-strict-focus
                   placeholder="Search..."
                   spellcheck="false"
                   type="text"
                   @input="updateSearchQuery">
            <i :class="{delete: 1, 'fas fa-times': 1, visible: searchQuery.length}" @click="clear"></i>

            <!-- Show available filters -->
            <i class="fas fa-fw fa-filter" @click="$store.commit('setActivePopup', 'SearchFilters')"></i>
        </div>

        <!-- Options -->
        <div class="options">

            <div class="option">
                <multi-switch-button :active="0"
                                     :options="['All', 'File', 'Folder']"
                                     @change="setTypeOption"/>
            </div>

            <div class="option">
                <simple-button text="Regex" @change="setRegexOption"/>
            </div>

            <div class="option">
                <simple-button text="Case insensitive" @change="setCaseInsensitivOption"/>
            </div>

            <!-- Introduction -->
            <intro-box id="1"
                       header="Search Options"
                       text="Filter by type, use regular expressions or ignore case."/>
        </div>
    </section>
</template>

<script>

    // Components
    import MultiSwitchButton from '../../../ui/input/TextSwitchButton';
    import SimpleButton      from '../../../ui/input/TextToggleButton';
    import IntroBox          from '../../../ui/specific/IntroBox';

    export default {

        components: {
            SimpleButton,
            MultiSwitchButton,
            IntroBox
        },

        data() {
            return {
                searchQuery: ''
            };
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
        },

        methods: {

            updateSearchQuery(e) {
                this.searchQuery = e.target.value;
                this.updateSearch();
            },

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
                (state === 'Folder') && (state = 'dir');

                this.$store.commit('search/setOption', {
                    key: 'type',
                    value: state.toLowerCase()
                });

                this.updateSearch();
            }
        }

    };
</script>

<style lang="scss" scoped>

    .search-bar {
        position: relative;
        padding: 1em;
        background: white;
        box-shadow: 0 0 3px 0 rgba($palette-asphalt, 0.05);
    }

    .search-field {
        @include flex(row, center);
        padding: 0.5em 0.1em;
        border-radius: 50em;

        &:focus-within {
            i {
                color: $palette-theme-primary;
            }
        }

        input {
            @include font(400, 0.9em);
            color: $palette-asphalt;
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
                pointer-events: none;
                transform: rotate(90deg);
                transition: all 0.3s;

                &.visible {
                    pointer-events: all;
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
                color: $palette-theme-primary;
            }
        }
    }

    .options {
        position: relative;
        @include inline-flex(row, stretch);
        margin: 0.5em 0.75em 0.5em 0.75em;

        .option {
            @include flex(row, center);
            margin-right: 0.5em;
        }
    }

    @include mobile {
        .search-bar {
            padding: 0.75em;
        }

        .search-field {
            font-size: 1.05em;
        }

        .options {
            font-size: 0.85em;
        }
    }

</style>
