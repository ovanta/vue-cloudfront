<template>
    <div class="index">

        <!-- Menu bar and the stuff right of it -->
        <menu-bar/>
        <div class="right-side">

            <!-- Info-bar, shows important messages -->
            <info-bar/>

            <!-- Tabs, dynamic, getting changed via menu tabs -->
            <navigator v-show="['marked', 'home', 'bin'].includes(activeTab)"/>

            <!-- Dashboard -->
            <dashboard v-show="activeTab === 'dashboard'"/>

            <!-- Upload bar - shows the current upload progress of files -->
            <upload-toasts/>
        </div>

        <!-- Overlays -->
        <loading-screen/>
        <file-preview/>
        <authentication/>
        <upload-area/>
        <dialog-box/>

        <!-- Popovers -->
        <search-filters/>
        <keyboard-shortcuts/>
        <share-via-link/>
        <settings/>

        <!-- Tooltip -->
        <tool-tip/>

        <div ref="styleStateIndicator" class="style-state-indicator"></div>

    </div>
</template>

<script>

    // Components
    import Navigator from './application/navigator/Navigator';
    import Dashboard from './application/dashboard/Dashboard';

    import ToolTip      from '../ui/specific/ToolTip';
    import MenuBar      from './application/MenuBar';
    import InfoBar      from './InfoBar';
    import UploadToasts from './UploadToasts';

    // Popovers
    import KeyboardShortcuts from './application/popup/KeyboardShortcuts';
    import SearchFilters     from './application/popup/SearchFilters';
    import ShareViaLink      from './application/popup/ShareViaLink';
    import Settings          from './application/popup/Settings';

    // Overlays
    import DialogBox      from './application/overlay/DialogBox';
    import LoadingScreen  from './application/overlay/LoadingScreen';
    import UploadArea     from './application/overlay/UploadArea';
    import FilePreview    from './application/overlay/filepreview/FilePreview';
    import Authentication from './authentication/Authentication';

    // Vue stuff
    import Vue        from 'vue';
    import {mapState} from 'vuex';

    export default {

        components: {
            InfoBar,
            MenuBar,
            UploadToasts,

            // Tabs
            Navigator,
            Dashboard,

            // Popovers and static components
            KeyboardShortcuts,
            SearchFilters,
            ShareViaLink,
            LoadingScreen,
            UploadArea,
            ToolTip,
            Settings,
            FilePreview,
            DialogBox,

            // Authentication
            Authentication
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['activeTab'])
        },

        mounted() {
            const {styleStateIndicator} = this.$refs;
            const checkAppliedStyles = () => Vue.prototype._appliedMediaQueries = getComputedStyle(styleStateIndicator, ':before').content.replace(/"/g, '');
            window.addEventListener('resize', checkAppliedStyles);
            checkAppliedStyles();
        }
    };

</script>

<style lang="scss" scoped>

    .index {
        font-family: $font-family;
        @include flex(row);
        user-select: none;
        background: mix($palette-asphalt, white, 1);
        overflow: hidden;

        .right-side {
            @include flex(column);
            overflow: hidden;
            width: 100%;
            height: 100%;
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

    .style-state-indicator {
        display: none;

        &::before {
            content: 'desktop';

            @include tablet {
                content: 'tablet';
            }

            @include mobile {
                content: 'mobile';
            }
        }
    }

    @include mobile {
        .index {
            flex-direction: column-reverse;
        }
    }

</style>
