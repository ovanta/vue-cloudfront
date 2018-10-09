<template>
    <div id="app">
        <main-content></main-content>
    </div>
</template>

<script>

    // Components
    import MainContent from './components/main-content/MainContent';

    export default {

        components: {MainContent},

        data() {
            return {};
        }
    };
</script>


<style lang="scss">

    // Some resets
    button,
    textarea,
    input {
        font-family: $font-family-open-sans;
        outline: none;
        border: none;
        background: transparent;
    }

    button {
        cursor: pointer;
    }

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    // Actual app layout
    html,
    body {
        height: 100%;
        width: 100%;
    }

    body {
        background: $palette-white-bright;
    }

    #app {
        font-family: $font-family-open-sans;
        position: fixed;
        margin: auto;
        display: flex;
        flex-direction: column;
        @include position(0, 0, 0, 0);
        @include width(70vw, 0, 1400px);
        @include height(90vh, 0, 950px);
    }
</style>
