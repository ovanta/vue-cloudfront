<template>
    <div class="audio-preview">

        <!-- Time and play-pause button -->
        <i :class="`fas fa-fw fa-${paused ? 'play' : 'pause'}`" @click="togglePlay"></i>
        <span class="time"><b>{{ elapsedTime | formatSeconds }}</b> / <b>{{ duration | formatSeconds }}</b></span>

        <!-- Volume slider and icon -->
        <slider :value="volume"
                class="volume-slider"
                @mouseleave="showVolume = false"
                @change="setVolume"/>

        <i :class="`fas fa-fw fa-volume-${volumeIcon}`"></i>

        <div class="progress-bar">
            <div :style="{width: `${(elapsedTime / duration) * 100}%`}"></div>
        </div>
    </div>
</template>

<script>

    // Components
    import Slider from '../../../../../ui/Slider';

    export default {
        components: {Slider},

        filters: {

            formatSeconds(value) {
                const minutes = String(Math.floor(value / 60)).padStart(2, '0');
                const seconds = String(Math.floor(value % 60)).padStart(2, '0');
                return `${minutes}:${seconds}`;
            }
        },

        props: {
            url: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                audio: null,
                paused: true,
                duration: 0,
                elapsedTime: 0,
                volume: 0
            };
        },

        computed: {

            volumeIcon() {
                if (this.volume < 0.33) {
                    return 'off';
                } else if (this.volume < 0.66) {
                    return 'down';
                } else {
                    return 'up';
                }
            }
        },

        mounted() {
            const {on} = this.utils;
            const audio = new Audio(this.url);

            on(audio, 'canplay', () => {
                this.volume = audio.volume = 0.25;
                this.duration = audio.duration;
                this.elapsedTime = audio.currentTime;
            });

            on(audio, 'timeupdate', () => this.elapsedTime = audio.currentTime);
            on(audio, 'volumechange', () => this.volume = audio.volume);

            this.audio = audio;
        },

        destroyed() {
            this.audio.pause();
        },

        methods: {

            togglePlay(e) {
                e.stopPropagation();
                this.audio[this.paused ? 'play' : 'pause']();
                this.paused = !this.paused;
            },

            setVolume(value) {
                this.audio.volume = value;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .audio-preview {
        position: relative;
        @include flex(row, center);
        color: $palette-deep-blue;
        margin: 0.5em 0 0.25em;
        padding-bottom: 0.75em;

        > i {
            flex-shrink: 0;
            font-size: 0.85em;
            margin-right: 0.5em;
            cursor: pointer;
        }

        > span {
            flex-shrink: 0;
            font-size: 0.87em;
        }

        .volume-slider {
            font-size: 0.75em;
            margin: 0 1.5em;
        }

        .progress-bar {
            position: absolute;
            @include size(100%, 2px);
            bottom: 0;
            background: $palette-decent-blue;

            div {
                position: absolute;
                @include position(0, auto, 0, 0);
                background: $palette-deep-blue;
            }
        }
    }

</style>
