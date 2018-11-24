<template>
    <div id="app" @contextmenu="preventDefault">

        <!-- Background shapes -->
        <div class="app-background">
            <svg class="left"
                 viewBox="0 0 500 500"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M0,0V500H124.914s53.473-56.5,74.963-175S124.914,0,124.914,0H0Z"></path>
            </svg>

            <svg class="right"
                 viewBox="0 0 500 500"
                 xmlns="http://www.w3.org/2000/svg">
                <path d="M325.529,500s-50.117-80.37,50.118-124.8S500,350,500,350V500H325.529Z"></path>
            </svg>
        </div>

        <!-- Actual application TODO: Move to component -->
        <div class="app-content">

            <!-- Menu bar and the stuff right of it -->
            <menu-bar></menu-bar>
            <div class="right-side">

                <!-- Info if user is currently in demo mode TODO: Remove -->
                <p v-if="$store.state.auth.userMode === 'demo'" class="info demo">
                    <i class="fas fa-fw fa-vial"></i>
                    <span>
                    Currently in demo mode, <a href="https://github.com/Simonwep/nettic/fork">fork it</a> or
                    check it out on <a href="https://github.com/Simonwep/nettic/">github</a>!
                    </span>
                </p>

                <!-- Show if the user is currently offline -->
                <p v-if="offline" class="info offline">
                    <i class="fas fa-fw fa-unlink"></i>
                    <span>No ethernet connection available. Readonly mode active.</span>
                </p>

                <!-- Tabs, dynamic, getting changed via menu tabs -->
                <navigator v-show="$store.state.activeTab === 'marked' || $store.state.activeTab === 'home'"></navigator>
                <history v-show="$store.state.activeTab === 'history'"></history>
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

    </div>
</template>

<script>

    // Global filters
    import '../vue-extensions/filters';

    // Global directives
    import '../vue-extensions/directives';

    // Global mixins
    import '../vue-extensions/mixins';

    // Components
    import Navigator from './components/application/navigator/Navigator';
    import History from './components/application/history/History';
    import MenuBar from './components/application/MenuBar';
    import ToolTip from './components/application/ToolTip';

    // Popovers
    import PopoverKeyboardShortcuts from './components/application/popovers/PopoverKeyboardShortcuts';
    import PopoverFilterInfo from './components/application/popovers/PopoverFilterInfo';

    // Loading screen and debug
    import LoadingScreen from './components/application/screens/LoadingScreen';
    import DebugScreen from './components/application/screens/DebugScreen';

    // Authentication screens
    import Authentication from './components/authentication/Authentication';

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    export default {

        components: {

            // Tabs
            MenuBar,
            Navigator,
            History,

            // Popovers and static components
            PopoverKeyboardShortcuts,
            PopoverFilterInfo,
            LoadingScreen,
            DebugScreen,
            ToolTip,

            // Authentication
            Authentication
        },

        data() {
            return {
                offline: !window.navigator.onLine
            };
        },

        mounted() {

            // Update nodes
            this.$store.dispatch('nodes/update');

            // Update timer every x seconds
            setInterval(() => this.$store.commit('updateTimer'), 1000);

            // Detect if the user goes online / offline
            window.addEventListener('online', () => this.offline = false);
            window.addEventListener('offline', () => this.offline = true);
        },

        methods: {

            preventDefault(e) {
                e.preventDefault();
            }

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

    a {
        color: inherit;
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

    .app-content {
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

            .info {
                @include flex(row, center, center);
                @include font(600, 0.75em);
                padding: 0.2em 0;

                i {
                    font-size: 0.8em;
                    margin-right: 0.5em;
                }

                &.demo {
                    background: $palette-deep-blue;
                    color: white;
                }

                &.offline {
                    background: $palette-tomatoe-red;
                    color: white;
                }
            }
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

    .app-background {
        position: fixed;
        z-index: -1;
        @include position(0, 0, 0, 0);

        svg {
            position: fixed;
            fill: $palette-bright-purple;
            @include size(100vmax);

            @include animate('1s ease') {
                from {
                    transform: scaleX(1.5);
                }
                to {
                    transform: none;
                }
            }
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

    // Switch to fullscreen mode if window is too small
    @media all and (max-width: 1000px), all and (max-height: 650px) {
        .app-content {
            min-width: 100vw;
            min-height: 100vh;
            border-radius: 0;
        }
    }
</style>
