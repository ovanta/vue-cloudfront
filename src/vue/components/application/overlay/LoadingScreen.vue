<template>
    <overlay :open="loadingData.open" class="loading-screen">
        <div class="box"></div>

        <div v-if="data.upload.active" class="upload">
            <div :style="{width: `${(data.upload.done / data.upload.total) * 100}%`}"></div>
        </div>

        <p v-else class="message">{{ loadingData.message }}...</p>
    </overlay>
</template>

<script>

    // Components
    import Overlay from './Overlay';

    // Config
    import config from '../../../../../config/config.json';

    // Vuex stuff
    import {mapState} from 'vuex';

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
            },

            ...mapState(['data'])
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

    .upload {
        position: relative;
        @include flex(row, center, center);
        margin-top: 2em;
        padding: 0.2em 0;
        background: $palette-decent-blue;
        width: 30%;
        border-radius: 50em;
        overflow: hidden;

        div {
            position: absolute;
            @include position(0, auto, 0, 0);
            background: $palette-deep-purple;
            transition: width 0.25s;
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
