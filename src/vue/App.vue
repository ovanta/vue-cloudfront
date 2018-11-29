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

        <!-- Actual application -->
        <index></index>

    </div>
</template>

<script>

    // Global filters
    import '../vue-extensions/filters';

    // Global directives
    import '../vue-extensions/directives';

    // Font-awesome styles
    import '@fortawesome/fontawesome-free/css/all.css';

    // Components
    import Index from './components/Index';

    export default {

        components: {Index},

        data() {
            return {};
        },

        mounted() {

            // Update nodes
            this.$store.dispatch('nodes/update');

            // Update timer every x seconds
            setInterval(() => this.$store.commit('updateTimer'), 1000);
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
