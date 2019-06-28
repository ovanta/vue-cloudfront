<template>
    <div class="settings">
        <h1>Settings</h1>

        <div class="parts">
            <credentials/>
        </div>

    </div>
</template>

<script>

    import Credentials from './Credentials';

    export default {

        components: {Credentials},

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .settings {
        @include flex(column);
        margin: 1em;

        > h1 {
            @include font(600, 1.25em);
            color: $palette-asphalt;
        }
    }

    .parts {
        @include flex(row, center);
        padding: 5em;

        .credentials {
            width: 50%;
        }
    }

</style>
