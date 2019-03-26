<template>
    <popup store-prop="SearchFilters"
           title="Search Filters"
           class="search-filters">

        <div class="header">
            <p>Description</p>
            <p>Examples</p>
        </div>

        <div v-for="filter of filters" class="filter">
            <span class="description">{{ filter.description }}</span>

            <div class="examples">
                <p v-for="example of filter.examples">{{ example }}</p>
            </div>
        </div>

    </popup>
</template>

<script>

    // Components
    import Popup from './Popup';

    export default {

        components: {Popup},

        data() {
            return {
                filters: [
                    {
                        examples: ['is:mp4', 'is:rb', 'is:jsp,xls'],
                        description: 'Filter result by file-type and use commas to select multiple types'
                    },
                    {
                        examples: ['size:>10MB', 'size:<6GiB', 'size:7.5KB-10MB'],
                        description: 'Set size range, limit or minimum.'
                    },
                    {
                        examples: ['date:>05.25.2015', 'date:<01.01.2018', 'date:05.01.2015-12.01.2016'],
                        description: 'Filter by last-modified date. The format is "Month.Day.Year"'
                    }
                ]
            };
        }
    };

</script>

<style lang="scss" scoped>

    .search-filters {
        &.open .filter .examples {
            user-select: text;
        }
    }

    .header {
        @include flex(row, space-between);

        p {
            @include font(600, 0.85em);
            color: $palette-deep-blue;
            width: 50%;
        }
    }

    .filter {
        @include flex(row);
        margin-bottom: 0.5em;

        .examples {
            @include flex(column);
            background: $palette-snow-white;
            color: rgba($palette-deep-blue, 0.85);
            font-family: monospace;
            padding: 0.5em 0.75em;
            border-radius: 0.15em;
            width: 50%;
            line-height: 1.3em;
        }

        .description {
            @include font(400, 0.8em);
            line-height: 1.3em;
            width: 50%;
            color: darken($palette-grayish-blue, 15);
        }
    }

</style>
