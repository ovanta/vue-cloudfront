<template>
    <video ref="video"
           :src="url"
           class="video-preview"
           controls></video>
</template>

<script>

    // Holds a reference to the currently playing video element
    let activeVideo = null;

    export default {
        props: {
            url: {
                type: String,
                required: true
            }
        },

        data() {
            return {};
        },

        mounted() {
            const {video} = this.$refs;
            this.utils.on(video, 'play', () => {

                // Pause other videoPreviews to prevent video overlap
                if (activeVideo) {
                    activeVideo.pause();
                }

                activeVideo = !video.paused ? video : null;
            });
        }
    };

</script>

<style lang="scss" scoped>

    .video-preview {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0.25em;
        margin: auto;
    }

</style>
