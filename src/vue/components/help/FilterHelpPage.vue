<template>
    <help title="Search Filters" storekey="searchFilter">

        <div class="filter" v-for="filter of filters">
            <span class="example">{{ filter.name }}:{{ filter.example }}</span>
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
                    {name: 'is', example: 'mp4', description: 'Filter result by type.'}
                ]
            };
        }
    };

</script>

<style lang="scss" scoped>

    .filter {
        @include flex(row, center);

        .example {
            color: white;
            background: $palette-bright-purple;
            font-family: monospace;
            padding: 0.25em 0.5em;
            border-radius: 0.15em;
            margin-right: 1em;
        }

        .description {
            @include font(600, 0.8em);
            color: darken($palette-grayish-blue, 15);
        }

    }

</style>
