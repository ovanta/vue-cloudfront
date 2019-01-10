<template>
    <overlay :open="loadingData.open" class="loading-screen">
        <div class="box"></div>

        <p v-if="loadingData.message" class="message">{{ loadingData.message }}...</p>
    </overlay>
</template>

<script>

    // Components
    import Overlay from './Overlay';

    // Config
    import config from '../../../../../config/config.json';

    export default {
        components: {Overlay},

        data() {
            return {};
        },

        computed: {

            /**
             * The change of the request status should also trigger
             * the placement of a new message.
             */
            loadingData() {
                return {
                    open: !!this.$store.state.requestsActive,
                    message: this.getRandomMessage()
                };
            }
        },

        methods: {

            getRandomMessage() {
                const msgs = config.loadingScreenMessages;

                if (Array.isArray(msgs)) {
                    return msgs[Math.floor(Math.random() * msgs.length)];
                } else if (typeof msgs === 'string') {
                    return msgs;
                } else {
                    return null;
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .loading-screen {
        @include flex(column, center, center);
        z-index: 150;
    }

    .box {
        position: relative;
        @include size(2.5em);
        background: $palette-deep-purple;
        animation-play-state: paused;

        $perspective: 5em;
        @include animate('3s ease-in-out infinite') {
            0% {
                transform: perspective($perspective);
            }
            25% {
                transform: perspective($perspective) rotateX(180deg) rotateY(0);
            }
            50% {
                transform: perspective($perspective) rotateX(180deg) rotateY(180deg);
            }
            75% {
                transform: perspective($perspective) rotateX(0) rotateY(180deg);
            }
            100% {
                transform: perspective($perspective) rotateX(0) rotateY(0);
            }
        }
    }

    .message {
        @include font(600, 0.85em);
        margin-top: 3em;
        font-style: italic;
        color: $palette-deep-purple;
        transform: translateY(-0.5em);
    }

</style>
