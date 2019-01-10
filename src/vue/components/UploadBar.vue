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

        <div class="uploads">
            <div v-for="upload of uploads" class="upload">
                <span class="circle"></span>

                <span class="size">

                    <span>{{ upload | genStatusMessage }}</span>

                    <!--<span>-->
                    <!--<b>{{ utils.readableByteCount(upload.done, Math.round) }}</b> /-->
                    <!--<b>{{ utils.readableByteCount(upload.total, Math.round) }}</b>-->
                    <!--<b> ({{ Math.round((upload.done / upload.total) * 100) }}%)</b>-->
                    <!--</span>-->
                </span>

                <div class="indicator">
                    <i v-if="upload.done / upload.total >= 1" class="fas fa-fw fa-check"></i>
                    <circle-progress-bar v-else :value="upload.done / upload.total"/>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    // Components
    import CircleProgressBar from '../ui/CircleProgressBar';
    // Vuex stuff

    export default {
        components: {CircleProgressBar},

        filters: {

            genStatusMessage(upload) {

                const pluralify = strings => {
                    const maxCount = 2;

                    // Strange case, return nothing
                    if (!strings.length) {
                        return 'nothing';
                    }

                    // If theres only one node, return type and the name of it
                    if (strings.length === 1) {
                        return `${strings[0]}`;
                    }

                    // Create a comma-seperated list of names
                    const end = strings.length > maxCount ? maxCount : strings.length - 1;
                    const nodesStr = strings.slice(0, end).map(v => v).join(', ');

                    if (strings.length <= maxCount) {
                        return `${nodesStr} and ${strings[end]}`;
                    } else {

                        /**
                         * If there is only one more node, just append it.
                         * Otherwise append 'x others' because '1 others' sounds odd.
                         */
                        const rest = strings.length - maxCount;
                        return `${nodesStr} and ` + (rest === 1 ? strings[maxCount] : `${rest} others`);
                    }
                };

                switch (upload.state) {
                    case 'init':
                        return 'Initializing...';
                    case 'stardet':
                        return 'Searching for files...';
                    case 'create-dirs':
                        return 'Creating required folders...';
                    case 'upload-files':
                        return `${Math.round((upload.done / upload.total) * 100)}% Uploading ${pluralify(upload.files)}`;
                    case 'done':
                        return `Uploaded ${pluralify(upload.files)}!`;
                    default:
                        return 'Here should be a message...';
                }
            }
        },

        data() {
            return {
                showDetails: true,
                open: false
            };
        },

        computed: {

            activeUploadCount() {
                return this.uploads.filter(v => v.state !== 'done').length;
            },

            uploads() {
                return this.$store.state.data.uploads;
            }
        },

        methods: {

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
        position: absolute;
        @include position(auto, 0.75em, 0.75em, auto);
        box-shadow: 0 0.15em 0.75em rgba(black, 0.1);
        border-radius: 0.15em;
        background: $palette-snow-white;
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
        background: linear-gradient(to bottom right, $palette-bright-purple, $palette-deep-purple);
        padding: 0.75em 1em;
        color: white;

        span {
            @include font(600, 0.78em);
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
            color: $palette-deep-blue;
            flex-shrink: 0;

            .circle {
                display: inline-block;
                @include size(6px);
                background: $palette-deep-blue;
                border-radius: 100%;
                margin-right: 0.75em;
                flex-shrink: 0;
            }

            .size {
                font-size: 0.8em;
                margin-right: 1.5em;
                line-height: 1.2em;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .indicator {
                position: relative;
                @include flex(row, center, center);
                @include size(24px);
                margin-left: auto;
                flex-shrink: 0;

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

</style>
