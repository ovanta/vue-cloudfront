<template>
    <div class="settings">

        <div class="header">
            <h1>Settings</h1>
        </div>

    </div>
</template>

<script>

    // Components
    import InputField from '../../../ui/InputField';

    export default {

        components: {InputField},

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .settings {
        @include flex(column);
        height: 100%;
        margin: 2em 1.5em 0 1.5em;

        .header {
            @include flex(row, center);
            border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
            padding-bottom: 0.25em;

            h1 {
                @include font(400, 1.25em);
                color: $palette-deep-blue;
                margin-right: auto;
            }
        }
    }

</style>
