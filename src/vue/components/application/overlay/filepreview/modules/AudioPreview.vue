<template>
    <div class="audio-preview">

        <!-- Time and play-pause button -->
        <i :class="`fas fa-fw fa-${paused ? 'play' : 'pause'}`" @click="togglePlay"></i>
        <span class="time"><b>{{ elapsedTime | formatSeconds }}</b> / <b>{{ duration | formatSeconds }}</b></span>

        <!-- Volume slider and icon -->
        <slider :value="volume"
                class="volume-slider"
                @change="setVolume"/>

        <i :class="`fas fa-fw fa-volume-${volumeIcon}`"></i>

        <slider :value="elapsedTime / duration"
                class="time-slider"
                @change="setTime"/>
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

        watch: {
            url(newUrl) {
                this.audio.src = newUrl;
            }
        },

        mounted() {
            const {on} = this.utils;
            const audio = new Audio(this.url);

            on(audio, 'loadedmetadata', () => {
                this.volume = audio.volume = 0.25;
                this.paused = true;
                this.duration = audio.duration;
                this.elapsedTime = audio.currentTime;
                audio.pause();
            });

            on(audio, ['pause', 'play', 'ended'], () => this.paused = audio.paused);
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
            },

            setTime(value) {
                this.audio.currentTime = value * this.duration;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .audio-preview {
        position: relative;
        @include flex(row, center, space-between);
        color: $palette-deep-blue;
        margin: 0.5em auto 0.25em;
        padding-bottom: 1.25em;
        width: 90%;

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
            flex-grow: 1;
        }

        .time-slider {
            position: absolute;
            @include position(auto, 0, 0.1em, 0);
            width: 100%;
            margin: 0 auto;
            font-size: 0.6em;
        }
    }

</style>
