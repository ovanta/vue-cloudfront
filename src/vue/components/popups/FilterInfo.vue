<template>
    <help title="SearchFilters" store-prop="SearchFilters">

        <div class="filter" v-for="filter of filters">

            <span class="example">
                {{ filter.name }}:{{filter.examples.join('|') }}
            </span>

            <span class="description">{{ filter.description }}</span>
        </div>

    </help>
</template>

<script>

    // Import component
    import Help from './Help';

    export default {

        components: {Help},

        data() {
            return {
                filters: [
                    {name: 'is', examples: ['mp4', 'rb', 'jsp,xls'], description: 'Filter result by type.'},
                    {name: 'size', examples: ['>10MB', '<6GiB', '7.5KB-10MB'], description: 'Set size range, limit or minimum.'}
                ]
            };
        }
    };

</script>

<style lang="scss" scoped>

    .filter {
        @include flex(row, center);
        margin-bottom: 0.5em;

        .example {
            @include flex(row);
            color: white;
            font-family: monospace;
            border-radius: 0.15em;
            margin-right: 2em;
            overflow: hidden;
            background: $palette-bright-purple;
            padding: 0.3em 0.5em 0.4em;
        }

        .description {
            @include font(600, 0.8em);
            flex-grow: 1;
            text-align: right;
            color: darken($palette-grayish-blue, 15);
        }
    }

</style>
