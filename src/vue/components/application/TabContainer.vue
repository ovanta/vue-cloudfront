<template>
    <div class="tab-container">

        <div class="tab-header">
            <h1>{{ title }}</h1>
            <slot name="header"></slot>
        </div>

        <div class="tab-content">
            <slot name="content"></slot>
        </div>

    </div>
</template>

<script>

    export default {

        props: {
            title: {
                type: String,
                required: true
            }
        },

        data() {
            return {};
        }

    };

</script>

<style lang="scss" scoped>

    .tab-container {
        @include flex(column);
        height: 100%;

        .tab-header {
            @include flex(row, center);
            background: white;
            box-shadow: 0 0 3px 0 rgba($palette-deep-blue, 0.05);
            padding: 1.25em 1.75em;
            flex-shrink: 0;

            h1 {
                @include font(400, 1.15em);
                color: $palette-deep-blue;
                margin-right: auto;
            }
        }

        .tab-content {
            @include flex(column);
            margin: 1.25em 1.5em 0 1.5em;
            flex-grow: 1;
        }
    }

</style>
