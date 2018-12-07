<template>
    <div class="index">

        <!-- Menu bar and the stuff right of it -->
        <menu-bar></menu-bar>
        <div class="right-side">

            <!-- Info-bar, shows important messages -->
            <info-bar></info-bar>

            <!-- Tabs, dynamic, getting changed via menu tabs -->
            <navigator v-show="activeTab === 'marked' || activeTab === 'home'"></navigator>
            <history v-show="activeTab === 'history'"></history>
            <terminal v-show="activeTab === 'terminal'"></terminal>
            <settings v-show="activeTab === 'settings'"></settings>
        </div>

        <!-- Loading screen (fixed) -->
        <loading-screen></loading-screen>

        <!-- Login Screen (fixed) -->
        <authentication></authentication>

        <!-- Debug screen (fixed) -->
        <debug-screen></debug-screen>

        <!-- Helping pages (fixed) -->
        <popover-filter-info></popover-filter-info>
        <popover-keyboard-shortcuts></popover-keyboard-shortcuts>

        <!-- Tooltip -->
        <tool-tip></tool-tip>

    </div>
</template>

<script>

    // Components
    import Navigator from './application/tabs/navigator/Navigator';
    import History   from './application/tabs/History';
    import Terminal  from './application/tabs/Terminal';
    import Settings  from './application/tabs/Settings';

    import MenuBar from './application/MenuBar';
    import ToolTip from './ToolTip';
    import InfoBar from './InfoBar';

    // Popovers
    import PopoverKeyboardShortcuts from './application/popovers/PopoverKeyboardShortcuts';
    import PopoverFilterInfo        from './application/popovers/PopoverFilterInfo';

    // Loading screen and debug
    import LoadingScreen from './application/screens/LoadingScreen';
    import DebugScreen   from './application/screens/DebugScreen';

    // Authentication screens
    import Authentication from './authentication/Authentication';

    // Vue stuff
    import {mapState} from 'vuex';

    export default {

        components: {
            MenuBar,

            // Tabs
            Navigator,
            History,
            Terminal,
            Settings,

            // Popovers and static components
            PopoverKeyboardShortcuts,
            PopoverFilterInfo,
            LoadingScreen,
            DebugScreen,
            ToolTip,
            InfoBar,

            // Authentication
            Authentication
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['activeTab'])
        }

    };

</script>

<style lang="scss" scoped>

    .index {
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
            overflow: hidden;
        }

        @include animate('0.75s ease-in-out') {
            from {
                transform: translateY(-1em);
            }
            to {
                filter: none;
                transform: none;
            }
        }
    }

</style>
