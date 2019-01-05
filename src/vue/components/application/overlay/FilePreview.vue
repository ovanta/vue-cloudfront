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

                <!-- Images -->
                <div v-if="currentNode.name.match(/\.(png|jpg|jpeg|svg|gif|bmp|webp|jpeg2000|ico)$/i)"
                     :style="{'background-image': `url('${url}')`}"
                     class="image"></div>

                <!-- Videos -->
                <video v-else-if="currentNode.name.match(/\.(webm|mp4|wav|flac)$/i)"
                       :src="url"
                       class="video"
                       controls
                       autoplay></video>

                <!-- Audio -->
                <audio v-else-if="currentNode.name.match(/\.(mp3|wav|ogg)$/i)"
                       :src="url"
                       controls></audio>

                <!-- PDFs -->
                <object v-else-if="currentNode.name.match(/\.pdf$/i)"
                        :data="url"
                        class="pdf"
                        type="application/pdf"
                        width="100%"
                        height="100%">
                </object>

                <!-- Fonts -->
                <div v-else-if="currentNode.name.match(/\.(ttf|otf|woff)$/i)"
                     :style="{'font-family': loadFont(url)}"
                     class="font">

                    <h6>The quick brown fox jumps over the lazy dog</h6>
                    <h5>The quick brown fox jumps over the lazy dog</h5>
                    <h4>The quick brown fox jumps over the lazy dog</h4>
                    <h3>The quick brown fox jumps over the lazy dog</h3>
                    <h2>The quick brown fox jumps over the lazy dog</h2>
                    <h1>The quick brown fox jumps over the lazy dog</h1>

                    <p>abcdefghijklmnopqrstuvwxyz<br>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>1234567890<br>!&quot;#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</p>
                </div>

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
    import config from '../../../../../config/config.json';

    // Components
    import Overlay from './Overlay';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {Overlay},

        data() {
            return {
                loadedFonts: {}
            };
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
            },

            loadFont(url) {

                // Check if font name has already been used
                if (this.loadedFonts[this.currentNode.name]) {
                    return this.loadedFonts[this.currentNode.name];
                }

                const name = `font-preview-${Date.now() + Math.floor(Math.random() * 100)}`;
                const style = document.createElement('style');
                style.innerHTML = `
                   @font-face {
                       font-family: '${name}';
                       src: url('${url}');
                   }
                `;

                document.head.appendChild(style);
                this.loadedFonts[this.currentNode.name] = name;
                return name;
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

            .image {
                flex-grow: 1;
                align-self: stretch;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center;
            }

            .video {
                max-width: 100%;
                max-height: 100%;
                border-radius: 0.25em;
            }

            .font {
                font-size: 1em;

                > * {
                    margin: 0.35em 0;
                }

                p {
                    margin-top: 1em;
                    line-height: 1.5em;
                }
            }
        }
    }


</style>
