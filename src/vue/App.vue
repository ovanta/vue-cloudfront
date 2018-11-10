<template>
    <div id="app" @contextmenu="preventDefault">


        <!-- Background shapes -->
        <div class="background">
            <svg class="left" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <path d="M0,0V500H124.914s53.473-56.5,74.963-175S124.914,0,124.914,0H0Z"></path>
            </svg>

            <svg class="right" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                <path d="M325.529,500s-50.117-80.37,50.118-124.8S500,350,500,350V500H325.529Z"></path>
            </svg>
        </div>

        <menu-bar></menu-bar>

        <div class="right-side">

            <!-- Tabs, dynamic, getting changed via menu tabs -->
            <navigator v-show="$store.state.activeTab === 'marked' || $store.state.activeTab === 'home'"></navigator>
            <history v-show="$store.state.activeTab === 'history'"></history>

            <!-- Debug screen (fixed) -->
            <debug-screen></debug-screen>

            <!-- Helping pages (fixed) -->
            <shortcuts-help-page></shortcuts-help-page>
            <filter-help-page></filter-help-page>
        </div>

    </div>
</template>

<script>

    // Global filters
    import './filters';

    // Global directives
    import './directives';

    // Global mixins
    import './mixins';

    // Components
    import Navigator from './components/navigator/Navigator';
    import History from './components/history/History';
    import DebugScreen from './components/DebugScreen';
    import MenuBar from './components/MenuBar';

    // Helping screens
    import ShortcutsHelpPage from './components/popups/KeyboardShortcuts';
    import FilterHelpPage from './components/popups/FilterInfo';

    import '@fortawesome/fontawesome-free/css/all.css';

    export default {

        components: {

            // Tabs
            Navigator,
            History,

            // Static items
            DebugScreen,
            ShortcutsHelpPage,
            FilterHelpPage,
            MenuBar
        },

        data() {
            return {};
        },

        methods: {

            preventDefault(e) {
                e.preventDefault();
            }

        },

        mounted() {
            this.$store.dispatch('nodes/update');
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

    ::-webkit-scrollbar {
        width: 0.3em;
        background: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: lighten($palette-grayish-blue, 10);
        border-radius: 0;
    }

    // Actual app layout
    html,
    body {
        height: 100%;
        width: 100%;
    }

    body {
        background: $palette-snow-white;
    }

    #app {
        font-family: $font-family-open-sans;
        position: absolute;
        margin: auto;
        user-select: none;
        @include flex(row);
        @include position(0, 0, 0, 0);
        @include width(70vw, 0, 1400px);
        @include height(90vh, 0, 950px);
        box-shadow: 0 0.4em 2.5em 0 rgba($palette-deep-blue, 0.13);
        border-radius: 0.5em;
        overflow: hidden;

        .right-side {
            background: mix($palette-snow-white, white, 75);
            @include flex(column);
            width: 100%;
        }

        .background {
            position: fixed;
            z-index: -1;
            @include position(0, 0, 0, 0);

            svg {
                position: fixed;
                @include size(100vmax);
                fill: $palette-bright-purple;
            }

            .left {
                left: 0;
                top: 0;
            }

            .right {
                right: 0;
                bottom: 0;
            }
        }
    }

    .selection-area {
        background: rgba($palette-cloud-blue, 0.02);
        border: 1px solid rgba($palette-cloud-blue, 0.6);
    }

    // Font awesome default size
    [class^='fa'] {
        font-size: 20px;
        line-height: 1;
        flex-shrink: 0;
    }
</style>
