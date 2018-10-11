<template>
    <section class="search-bar" @blur="showFilter = false">

        <!-- Search-bar with filter functions -->
        <div class="search-field">

            <input type="text" placeholder="Search all files" spellcheck="false"
                   @focus="showFilter = true"
                   v-model="search">

            <i class="material-icons">search</i>
        </div>

        <!-- Search tips -->
        <div :class="{filter:1, open: showFilter}">
            <span class="bsp"
                  v-for="{type, example} of filter"
                  @click="addFilter(type)">
                <b>{{ type }}:</b>{{ example }}
            </span>
        </div>

    </section>
</template>

<script>
    export default {

        data() {
            return {

                // Available filter and toggle boolean
                showFilter: false,
                filter: [
                    {type: 'is', example: 'mp4,mp3'},
                    {type: 'created', example: '25.03.2018'},
                    {type: 'changed', example: '13.02.2002'}
                ],

                search: ''

            };
        },

        methods: {

            addFilter(filter) {
                console.log('add', filter);
                this.search.trim();
                this.search += ` ${filter}:`;
            }

        }

    };
</script>


<style lang="scss" scoped>

    .search-field {
        position: relative;
        @include flex(row-reverse, center);
        padding: 0.2em 0.1em;

        input {
            flex-grow: 1;
            margin-left: 0.5em;
            font-weight: 600;
            color: $palette-grayish-blue;

            &:focus {

                ~ i::after {
                    width: 100%;
                }

                ~ i {
                    color: $palette-grayish-blue;
                }

            }

            &::placeholder {
                color: rgba($palette-grayish-blue, 0.5);
            }
        }

        i {
            color: rgba($palette-grayish-blue, 0.5);
            margin: 0 0.1em;
            transition: all 0.3s;

            &::before,
            &::after {
                @include pseudo();
                @include position(auto, 0, -2px, 0);
                @include size(0, 1px);
                margin: auto;
                transition: all 0.3s;
            }

            &::before {
                background: rgba($palette-grayish-blue, 0.2);
                width: 100%;
            }

            &::after {
                background: $palette-grayish-blue;
                z-index: 100;
            }
        }
    }

    .filter {
        @include flex(column);
        position: absolute;
        left: 0;
        margin-top: 0.5em;
        font-size: 0.8em;

        .bsp {
            background: rgba($palette-grayish-blue, 0.06);
            color: rgba($palette-grayish-blue, 1);
            padding: 0.2em 0.7em;
            border-radius: 0.2em;
            margin: 0.25em auto 0.25em 0;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
            transform: translateY(-0.15em);
            visibility: hidden;
            opacity: 0;
            cursor: pointer;

            &:hover {

            }
        }

        &.open {
            .bsp {
                @include sequentialAnimationDelay(5, 0.05s);
                @include animate('0.5s ease forwards') {
                    to {
                        transform: none;
                        visibility: visible;
                        opacity: 1;
                    }
                }
            }
        }
    }

</style>
