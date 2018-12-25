<template>
    <div class="index">

        <!-- Menu bar and the stuff right of it -->
        <menu-bar/>
        <div class="right-side">

            <!-- Info-bar, shows important messages -->
            <info-bar/>

            <!-- Tabs, dynamic, getting changed via menu tabs -->
            <navigator v-show="activeTab === 'marked' || activeTab === 'home'"/>
            <history v-show="activeTab === 'history'"/>
            <settings v-show="activeTab === 'settings'"/>
        </div>

        <!-- Loading screen (fixed) -->
        <loading-screen/>

        <!-- Login Screen (fixed) -->
        <authentication/>

        <!-- Helping pages (fixed) -->
        <popover-filter-info/>
        <popover-keyboard-shortcuts/>

        <!-- Tooltip -->
        <tool-tip/>

        <!-- Upload area -->
        <upload-area/>

    </div>
</template>

<script>

    // Components
    import Navigator from './application/tabs/navigator/Navigator';
    import History   from './application/tabs/History';
    import Settings  from './application/tabs/Settings';

    import MenuBar from './application/MenuBar';
    import ToolTip from '../ui/ToolTip';
    import InfoBar from './InfoBar';

    // Popovers
    import PopoverKeyboardShortcuts from './application/popovers/PopoverKeyboardShortcuts';
    import PopoverFilterInfo        from './application/popovers/PopoverFilterInfo';

    // Loading screen
    import LoadingScreen from './application/screens/LoadingScreen';

    // File drop area
    import UploadArea from './application/screens/UploadArea';

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
            Settings,

            // Popovers and static components
            PopoverKeyboardShortcuts,
            PopoverFilterInfo,
            LoadingScreen,
            UploadArea,
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
        user-select: none;
        @include flex(row);
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
