<template>
    <popup title="SearchFilters" store-prop="SearchFilters">

        <div class="header">
            <p>Description</p>
            <p>Examples</p>
        </div>

        <div class="filter" v-for="filter of filters">
            <span class="description">{{ filter.description }}</span>

            <div class="examples">
                <p v-for="example of filter.examples">{{example }}</p>
            </div>
        </div>

    </popup>
</template>

<script>

    // Import component
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
                    }
                ]
            };
        }
    };

</script>

<style lang="scss" scoped>

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
        }

        .description {
            @include font(400, 0.8em);
            width: 50%;
            color: darken($palette-grayish-blue, 15);
        }
    }

</style>
