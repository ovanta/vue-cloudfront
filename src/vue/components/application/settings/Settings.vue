<template>
    <div class="settings">
        <h1>Settings</h1>

        <div class="parts">
            <credentials/>
            <global/>
        </div>

    </div>
</template>

<script>

    // Setting parts
    import Credentials from './Credentials';
    import Global      from './Global';

    export default {

        components: {Credentials, Global},

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .settings {
        @include flex(column);
        flex-grow: 1;
        margin: 1em;

        > h1 {
            @include font(600, 1.25em);
            color: $palette-asphalt;
        }
    }

    .parts {
        @include flex(row, center, center);
        flex-grow: 1;
        padding: 2.5em;

        .credentials,
        .global {
            margin: 2em;
        }
    }

</style>
