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

                <!-- Preview -->
                <embed-file-preview :node="currentNode">

                    <!-- Fallback if no preview is available -->
                    <div class="no-preview">
                        Preview not available for
                        <span>{{ currentNode.name }}</span>.

                        <button @click="$store.dispatch('data/download', {node: currentNode})">
                            <i class="fas fa-cloud-download-alt"></i>
                            <span>Download instead</span>
                        </button>
                    </div>

                </embed-file-preview>

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

    // Components
    import Overlay          from '../Overlay';
    import EmbedFilePreview from './EmbedFilePreview';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {
            Overlay,
            EmbedFilePreview
        },

        data() {
            return {};
        },

        computed: {
            ...mapState(['filepreview']),

            currentNode() {
                const {index, nodes} = this.filepreview;
                return nodes[index];
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
            color: $palette-asphalt;
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
        min-height: 0;

        > i {
            color: $palette-asphalt;
            cursor: pointer;
            transition: all 0.3s;
            font-size: 1.25em;
            opacity: 0.25;
            flex-shrink: 0;
            margin: auto 0;

            &:hover {
                color: $palette-theme-secondary;
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
            @include flex(column, center, center);
            flex-grow: 1;
            margin: 2em;
            min-height: 0;

            .embed-file-preview {
                min-width: 40%;
            }

            .download-btn {
                position: absolute;
                @include position(auto, 0, -0.5em, auto);
                @include size(30px);
                cursor: pointer;
                fill: $palette-snow-white;
                background: $palette-asphalt;
                padding: 0.35em;
                border-radius: 0.15em;
                transition: all 0.3s;

                &:hover {
                    background: lighten($palette-asphalt, 5);
                }
            }

            .no-preview {
                @include font(400, 0.9em);
                color: $palette-asphalt;
                text-align: center;
                width: 100%;

                > span {
                    font-weight: 600;
                }

                > button {
                    @include flex(row, center, center);
                    margin: 1em auto 0;
                    background: $palette-asphalt;
                    color: $palette-snow-white;
                    transition: all 0.3s;
                    padding: 0.5em 1em;
                    border-radius: 0.15em;

                    i {
                        font-size: 1em;
                        margin-right: 0.55em;
                        color: $palette-snow-white;
                    }


                    &:hover {
                        background: lighten($palette-asphalt, 5);
                    }
                }
            }
        }
    }

    @include MQPhones {
        .preview {
            .file {
                margin: 0 0.25em;
            }
        }
    }

</style>
