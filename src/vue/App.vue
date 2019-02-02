<template>
    <div id="app" @contextmenu.prevent="">

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

        <!-- Actual application -->
        <cloudfront class="app-content"/>

    </div>
</template>

<script>

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    // Normalize css to look (almost) equal on all browsers
    import 'normalize.css';

    // Components
    import Cloudfront from './components/Cloudfront';

    export default {

        components: {Cloudfront},

        data() {
            return {};
        },

        beforeCreate() {

            // Try to recreate session
            const apikey = localStorage.getItem('apikey');

            if (apikey) {
                this.$store.dispatch('auth/key', {apikey});
            }
        }
    };
</script>

<style lang="scss">

    // Some resets
    button,
    textarea,
    input {
        font-family: $font-family;
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
    body,
    #app {
        height: 100%;
        width: 100%;
    }

    body {
        background: $palette-snow-white;
        font-family: $font-family;
    }

    .app-background {
        position: fixed;
        z-index: -1;
        @include position(0, 0, 0, 0);

        svg {
            position: fixed;
            fill: $palette-theme-secondary;
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

    .app-content {
        position: absolute;
        @include width(70%, 0, 1400px);
        @include height(90%, 0, 950px);
        @include position(0, 0, 0, 0);
        border-radius: 0.2em;
        margin: auto;
        box-shadow: 0 0.4em 2.5em 0 rgba($palette-deep-blue, 0.13);
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
    @include tablet {
        .app-content {
            min-width: 100%;
            min-height: 100%;
            border-radius: 0;
        }
    }
</style>
