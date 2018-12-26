<template>
    <overlay :open="!!currentNode" class="file-preview">

        <div class="header">
            <p class="filename">{{ currentNode && currentNode.name }}</p>
            <i class="fas fa-fw fa-times" @click="close"></i>
        </div>

        <div class="preview">
            <i class="fas fa-fw fa-chevron-left" @click="next"></i>

            <!-- Actual preview -->
            <div v-if="currentNode" class="file">

                <!-- Images -->
                <div v-if="currentNode.name.match(/\.(png|jpg|jpeg|svg|gif|bmp|webp|jpeg2000)$/)"
                     :style="{'background-image': `url(${getUrl()})`}"
                     class="image"></div>

                <!-- Videos -->
                <video v-else-if="currentNode.name.match(/\.(webm|mp4|wav|flac)$/)"
                       :src="getUrl()"
                       class="video"
                       controls
                       autoplay></video>

                <!-- Message if no preview is available -->
                <div v-else class="no-preview">
                    Preview not available for
                    <span>{{ currentNode.name }}</span>. -
                    <button @click="$store.dispatch('download', {node: currentNode})">Download instead?</button>
                </div>

            </div>

            <i class="fas fa-fw fa-chevron-right" @click="previous"></i>
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
                index: 0
            };
        },

        computed: {
            ...mapState(['filepreview']),

            currentNode() {
                return this.filepreview.nodes && this.filepreview.nodes[this.index];
            }
        },

        methods: {

            close() {

                // Reset index and clear preview
                this.index = 0;
                this.$store.commit('filepreview/clear');
            },

            next() {
                if (this.index - 1 > 0) {
                    this.index--;
                }
            },

            previous() {
                if ((this.index + 1) < this.filepreview.nodes.length) {
                    this.index++;
                }
            },

            getUrl() {
                return `${config.apiEndPoint}/download?id=${this.currentNode.id}&apikey=${this.$store.state.auth.apikey}`;
            }

        }

    };

</script>

<style lang="scss" scoped>

    .file-preview {
        position: absolute;
        @include position(0, 0, 0, 0);
        @include flex(column);
        background: $palette-snow-white;
        z-index: 1;
        padding: 1.5em;
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
        }

        .file {
            @include flex(row, center, center);
            flex-grow: 1;
            margin: 2em;

            .no-preview {
                @include font(400, 0.9em);
                color: $palette-deep-blue;
                text-align: center;
                width: 100%;

                span {
                    font-style: italic;
                    font-weight: 600;
                }

                button {
                    text-align: center;
                    color: $palette-deep-purple;
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
                border-radius: 0.25em;
            }
        }
    }


</style>
