<template>
    <overlay :open="!!currentNode" class="file-preview">

        <div class="header">
            <p class="filename">{{ currentNode && currentNode.name }}</p>
            <i class="fas fa-fw fa-times" @click="close"></i>
        </div>

        <div class="preview">
            <i :class="{'fas fa-fw fa-chevron-left': 1, blocked: (filepreview.index - 1) < 0}"
               @click="$store.commit('filepreview/previous')"></i>

            <!-- Actual preview -->
            <div v-if="currentNode" class="file">

                <!-- Previews -->
                <image-preview v-if="currentNode.name.match(/\.(png|jpg|jpeg|svg|gif|bmp|webp|jpeg2000|ico)$/i)" :url="url"/>
                <video-preview v-else-if="currentNode.name.match(/\.(webm|mp4|wav|flac)$/i)" :url="url"/>
                <audio-preview v-else-if="currentNode.name.match(/\.(mp3|wav|ogg)$/i)" :url="url"/>
                <pdf-preview v-else-if="currentNode.name.match(/\.pdf$/i)" :url="url"/>
                <font-preview v-else-if="currentNode.name.match(/\.(ttf|otf|woff)$/i)" :url="url"/>

                <!-- Message if no preview is available -->
                <div v-else class="no-preview">
                    Preview not available for
                    <span>{{ currentNode.name }}</span>.
                </div>

                <svg xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 384 512"
                     class="download-btn"
                     @click="$store.dispatch('data/download', {node: currentNode})">

                    <path
                        d="M348.5 232.1l-148 148.4c-4.7 4.7-12.3 4.7-17 0l-148-148.4c-4.7-4.7-4.7-12.3 0-17l19.6-19.6c4.8-4.8 12.5-4.7 17.1.2l93.7 97.1V44c0-6.6 5.4-12 12-12h28c6.6 0 12 5.4 12 12v248.8l93.7-97.1c4.7-4.8 12.4-4.9 17.1-.2l19.6 19.6c4.9 4.7 4.9 12.3.2 17zM372 428H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h360c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12z"></path>
                </svg>
            </div>

            <i :class="{'fas fa-fw fa-chevron-right': 1, blocked: (filepreview.index + 2) > filepreview.nodes.length}"
               @click="$store.commit('filepreview/next')"></i>
        </div>

    </overlay>
</template>

<script>

    // Config
    import config from '../../../../../../config/config.json';

    // Components
    import Overlay from '../Overlay';

    // Preview components
    import FontPreview  from './modules/FontPreview';
    import PDFPreview   from './modules/PDFPreview';
    import AudioPreview from './modules/AudioPreview';
    import VideoPreview from './modules/VideoPreview';
    import ImagePreview from './modules/ImagePreview';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {
            Overlay,
            FontPreview,
            ImagePreview,
            VideoPreview,
            AudioPreview,
            'pdf-preview': PDFPreview
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['filepreview']),

            currentNode() {
                const {index, nodes} = this.filepreview;

                return nodes[index];
            },

            url() {
                const name = encodeURIComponent(this.currentNode.name);
                return `${config.apiEndPoint}/static/${name}?id=${this.currentNode.id}&apikey=${this.$store.state.auth.apikey}`;
            }
        },

        methods: {

            close() {

                // Reset index and clear preview
                this.$store.commit('filepreview/clear');
            }
        }
    };
</script>

<style lang="scss" scoped>

    .file-preview {
        @include flex(column);
        padding: 1.5em;
        z-index: 1;
    }

    .header {
        @include flex(row, center, space-between);
        flex-shrink: 0;

        p {
            @include font(400, 0.95em);
            color: $palette-deep-blue;
        }

        i {
            color: $palette-decent-blue;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                color: $palette-tomatoe-red;
            }
        }
    }

    .preview {
        @include flex(row, stretch, space-between);
        flex-grow: 1;

        i {
            color: $palette-deep-blue;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 1.25em;
            opacity: 0.25;
            flex-shrink: 0;
            margin: auto 0;

            &:hover {
                color: $palette-bright-purple;
                opacity: 1;
            }

            &:active {
                transform: scale(1.1);
            }

            &.blocked {
                pointer-events: none;
                cursor: default;
                opacity: 0;
            }
        }

        .file {
            position: relative;
            @include flex(row, center, center);
            flex-grow: 1;
            margin: 2em;

            .download-btn {
                position: absolute;
                @include position(auto, 0, 0, auto);
                @include size(30px);
                cursor: pointer;
                fill: $palette-snow-white;
                background: $palette-deep-blue;
                padding: 0.35em;
                border-radius: 0.15em;
                transition: all 0.3s;

                &:hover {
                    background: lighten($palette-deep-blue, 5);
                }
            }

            .no-preview {
                @include font(400, 0.9em);
                color: $palette-deep-blue;
                text-align: center;
                width: 100%;

                span {
                    font-style: italic;
                    font-weight: 600;
                }
            }
        }
    }

</style>
