<template>
    <div :class="{'loader': 1, open: data.open}">
        <div class="box"></div>
        <p class="message">{{ data.message }}...</p>
    </div>
</template>

<script>

    // Config
    import config from '../../../../../config/default';

    export default {

        data() {
            return {};
        },

        computed: {

            /**
             * The change of the request status should also trigger
             * the placement of a new message.
             */
            data() {
                return {
                    open: this.$store.state.requestsActive,
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
                }
            }

        }
    };

</script>

<style lang="scss" scoped>

    $big-border-radius: 2em;
    $small-border-radius: 0.15em;
    $jump-height: 0.25em;

    .loader {
        position: absolute;
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        background: $palette-snow-white;
        z-index: 150;
        opacity: 0;
        pointer-events: none;
        transition: all 0.3s;

        &.open {
            opacity: 1;
            pointer-events: all;

            // Play animation only if visible
            .box {
                animation-play-state: running;
            }
        }
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
        margin-top: 2em;
        font-style: italic;
        color: $palette-deep-purple;
        transform: translateY(-0.5em);
    }

</style>
