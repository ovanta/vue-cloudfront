<template>
    <video :src="url"
           class="video-preview"
           controls
           autoplay></video>
</template>

<script>

    export default {
        props: {
            url: {
                type: String,
                required: true
            }
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .video-preview {
        max-width: 100%;
        max-height: 100%;
        border-radius: 0.25em;
    }

</style>
