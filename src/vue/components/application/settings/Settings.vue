<template>
    <div class="settings">

        <section>
            <h1>Credentials</h1>
            <credentials/>
        </section>

        <section>
            <h1>Look and feel</h1>
            <global/>
        </section>

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
        @include flex(row, stretch, center);
        flex-grow: 1;
        margin: 1em;

        > section {

            > h1 {
                @include font(600, 1.15em);
                color: $palette-asphalt;
                margin-bottom: 2em;
            }
        }
    }

</style>
