<template>
    <div :class="{'embed-file-preview': 1, empty}">

        <!-- Previews -->
        <image-preview v-if="node.name.match(/\.(png|jpg|jpeg|svg|gif|bmp|webp|jpeg2000|ico)$/i)" :url="url"/>
        <video-preview v-else-if="node.name.match(/\.(webm|mp4|wav|flac)$/i)" :url="url"/>
        <audio-preview v-else-if="node.name.match(/\.(mp3|wav|ogg)$/i)" :url="url"/>
        <pdf-preview v-else-if="node.name.match(/\.pdf$/i)" :url="url"/>
        <font-preview v-else-if="node.name.match(/\.(ttf|otf|woff)$/i)" :url="url"/>

        <slot v-else></slot>
    </div>
</template>

<script>

    // Preview components
    import FontPreview  from './modules/FontPreview';
    import PDFPreview   from './modules/PDFPreview';
    import AudioPreview from './modules/AudioPreview';
    import VideoPreview from './modules/VideoPreview';
    import ImagePreview from './modules/ImagePreview';

    export default {
        components: {
            FontPreview,
            ImagePreview,
            VideoPreview,
            AudioPreview,
            'pdf-preview': PDFPreview
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
                return this.$store.getters['buildStaticUrl'](this.node);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .embed-file-preview {
        @include flex(column, flex-start, flex-start);
        min-height: 0;
    }

</style>
