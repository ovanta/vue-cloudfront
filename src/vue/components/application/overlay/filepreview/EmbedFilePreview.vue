<template>
    <div :class="{'embed-file-preview': 1, empty}">

        <!-- Previews -->
        <image-preview v-if="node.name.match(/\.(png|jpg|jpeg|svg|gif|bmp|webp|jpeg2000|ico|apng)$/i)" :url="url"/>
        <video-preview v-else-if="node.name.match(/\.(webm|mp4|wav|flac)$/i)" :url="url"/>
        <audio-preview v-else-if="node.name.match(/\.(mp3|wav|ogg)$/i)" :url="url"/>
        <font-preview v-else-if="node.name.match(/\.(ttf|otf|woff)$/i)" :url="url"/>

        <slot v-else-if="empty = true"></slot>
    </div>
</template>

<script>

    // Preview components
    import FontPreview  from './modules/FontPreview';
    import AudioPreview from './modules/AudioPreview';
    import VideoPreview from './modules/VideoPreview';
    import ImagePreview from './modules/ImagePreview';

    export default {
        components: {
            FontPreview,
            ImagePreview,
            VideoPreview,
            AudioPreview
        },

        props: {
            node: {
                type: Object,
                required: true
            }
        },

        data() {
            return {
                empty: false
            };
        },

        computed: {
            url() {

                /* eslint-disable vue/no-side-effects-in-computed-properties */
                this.empty = false;
                return this.$store.getters.buildStaticUrl(this.node);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .embed-file-preview {
        @include flex(column, center, center);
        @include size(100%);
    }

</style>
