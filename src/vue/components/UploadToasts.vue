<template>
    <div :class="{'upload-bar': 1, 'show-details': showDetails, open: uploads.length || open}">

        <div class="header">
            <span v-if="activeUploadCount === 1">One upload active.</span>
            <span v-else-if="activeUploadCount > 1">{{ activeUploadCount }} uploads active.</span>
            <span v-else>{{ uploads.length > 1 ? `${uploads.length} uploads` : 'One upload' }} complete!</span>

            <i class="fas fa-fw fa-angle-down" @click="showDetails = !showDetails"></i>
            <i v-if="!activeUploadCount"
               class="fas fa-fw fa-times"
               @click="close"></i>
        </div>

        <!-- List of active uploads -->
        <div ref="uploads" class="uploads">
            <div v-for="upload of uploads" class="upload">

                <span class="info-message">{{ genStatusMessage(upload) }}</span>

                <div class="indicator">

                    <!-- Icons -->
                    <i v-if="upload.state === 'aborted'" class="fas fa-fw fa-trash"></i>
                    <i v-else-if="upload.state === 'failed'" class="fas fa-fw fa-exclamation"></i>
                    <i v-else-if="upload.done / upload.total >= 1" class="fas fa-fw fa-check"></i>

                    <circle-progress-bar v-if="(upload.done / upload.total < 1 || !upload.total) && !['aborted', 'failed'].includes(upload.state)"
                                         :indeterminate="['init', 'stardet', 'create-dirs'].includes(upload.state)"
                                         :value="upload.done / upload.total"/>

                    <!-- Abort button -->
                    <button v-if="upload.state === 'upload-files'" class="cancel">
                        <i class="fas fa-fw fa-times" @click="cancel(upload)"></i>
                    </button>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    // Components
    import CircleProgressBar from '../ui/loaders/CircleProgressBar';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {CircleProgressBar},

        data() {
            return {
                showDetails: true,
                open: false
            };
        },

        computed: {
            ...mapState(['auth']),

            activeUploadCount() {

                // $refs is not available during mounting
                /* eslint-disable vue/no-side-effects-in-computed-properties */
                if (this.$refs.uploads) {
                    this.$refs.uploads.scrollTop = 0;
                }

                return this.uploads.filter(v => v.state !== 'done' && v.state !== 'aborted').length;
            },

            uploads() {
                const sortMap = ['failed', 'aborted', 'done', 'upload-files', 'create-dirs', 'started', 'init'];
                const uploads = [...this.$store.state.data.uploads];

                uploads.sort((a, b) => sortMap.indexOf(a.state) - sortMap.indexOf(b.state));
                return uploads;
            }
        },

        methods: {

            genStatusMessage(upload) {
                const pluralify = strings => this.$utils.readableStringSequence(strings, 2);

                // Create a appropriate message
                switch (upload.state) {
                    case 'init':
                        return 'Initializing...';
                    case 'stardet':
                        return 'Searching for files...';
                    case 'create-dirs':
                        return 'Creating folders...';
                    case 'upload-files': {
                        const percent = Math.round((this.$utils.limit(upload.done / upload.total, 0, 1)) * 100);
                        return `${percent}% - Uploading ${pluralify(upload.files)}`;
                    }
                    case 'done':
                        return `Uploaded ${pluralify(upload.files)}!`;
                    case 'aborted':
                        return 'Upload canceled';
                    case 'failed': {

                        // Try to resolve error code
                        switch ((upload.error || {}).code) {
                            case -1:
                                return 'User not logged in. Please reload the page.';
                            case 2:
                                return `Upload limit of ${this.$utils.readableByteCount(this.auth.status.availableSpace)} exceed.`;
                            default:
                                return 'Something went wrong...';
                        }
                    }
                    default:
                        return 'Here should be a message...';
                }
            },

            close() {
                this.open = false;
                this.$store.commit('data/reset');
            },

            cancel(upload) {
                upload.cancel && upload.cancel();
            }
        }
    };

</script>

<style lang="scss" scoped>

    .upload-bar {
        @include position(auto, 0.75em, 0.75em, auto);
        position: absolute;
        box-shadow: 0 0.15em 0.75em RGBA(var(--primary-text-color), 0.1);
        border-radius: 0.15em;
        background: RGB(var(--secondary-background-color));
        overflow: hidden;
        transition: all 0.5s;

        &:not(.open) {
            transform: translateY(120%);
            opacity: 0;
        }

        &.show-details {

            .uploads {
                max-height: 10em;
                padding: 0.5em 1em;
            }

            .header i {
                transform: none;
            }
        }
    }

    .header {
        @include flex(row, center);
        background: linear-gradient(to bottom right, RGB(var(--palette-theme-secondary)), RGB(var(--palette-theme-primary)));
        padding: 0.75em 1em;
        color: RGB(var(--primary-background-color));

        span {
            @include font(600, 0.75em);
            margin-right: auto;
        }

        i {
            font-size: 0.9em;
            cursor: pointer;
            transition: all 0.3s;
            transform: rotate(180deg);
            margin-left: 0.25em;

            &.fa-times {
                font-size: 0.75em;
            }
        }
    }

    .uploads {
        @include flex(column-reverse);
        max-height: 0;
        padding: 0 1em;
        transition: all 0.3s;
        overflow-y: scroll;
        width: 18em;

        .upload {
            @include flex(row, center);
            padding: 0.5em 0;
            color: RGB(var(--primary-text-color));
            flex-shrink: 0;

            &:hover .indicator .cancel {
                opacity: 1;
            }

            .info-message {
                @include font(600, 0.75em);
                @include white-space-overflow;
                margin-right: 1.5em;
                line-height: 1.2em;
            }

            .indicator {
                position: relative;
                @include flex(row, center, center);
                @include size(24px);
                margin-left: auto;
                flex-shrink: 0;

                .cancel {
                    @include flex(row, center, center);
                    @include size(26px);
                    position: absolute;
                    background: RGB(var(--primary-text-color));
                    border-radius: 100%;
                    color: RGB(var(--primary-background-color));
                    font-size: 0.8em;
                    opacity: 0;
                    transition: all 0.3s;
                }

                .circle-progress-bar {
                    @include size(100%);
                }

                i {
                    font-size: 0.8em;
                    flex-shrink: 1;
                }
            }
        }
    }

    @include mq-phones {
        .upload-bar {
            bottom: 10%;
        }
    }

</style>
