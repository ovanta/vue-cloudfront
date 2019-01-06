<template>
    <overlay :open="loadingData.open" class="loading-screen">
        <div class="box"></div>

        <!-- Upload progress bar -->
        <div v-if="data.upload.active" class="upload">

            <p v-if="data.upload.done > 0">
                Uploaded <b>{{ utils.readableByteCount(data.upload.done) }}</b> of
                <b>{{ utils.readableByteCount(data.upload.total) }}</b> -
                <b> {{ Math.round((data.upload.done / data.upload.total) * 100) }}%</b>
            </p>

            <p v-else>
                Found <b> {{ utils.readableByteCount(data.upload.total) }}</b> so far...
            </p>

            <div :class="{'progress-bar': 1, invisible: !data.upload.done}">
                <div :style="{width: `${(data.upload.done / data.upload.total) * 100}%`}"></div>
            </div>
        </div>

        <p v-else-if="loadingData.message" class="message" >{{ loadingData.message }}...</p>
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
                } else {
                    return null;
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
        @include flex(column);
        margin-top: 4em;
        width: 30%;

        p {
            @include font(400, 0.8em);
            margin-bottom: 0.5em;
            text-align: center;
        }

        .progress-bar {
            position: relative;
            padding: 0.25em 0;
            background: $palette-decent-blue;
            border-radius: 50em;
            overflow: hidden;
            transition: all 0.3s;

            div {
                position: absolute;
                @include position(0, auto, 0, 0);
                background: $palette-deep-purple;
                border-radius: 50em;
                transition: width 0.25s;
            }

            &.invisible {
                opacity: 0;
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
