<template>
    <div :class="{'upload-area': 1, 'drag-over': dragOver}">

        <i class="fas fa-file-upload"></i>
        <p>Upload</p>

    </div>
</template>

<script>

    export default {

        data() {
            return {
                dragOver: false
            };
        },

        mounted() {
            this.utils.on(
                window,
                ['drag', 'dragend', 'dragenter', 'dragstart', 'dragleave', 'dragover', 'drop'],
                e => {

                    if (e.type === 'dragenter') {

                        // Check if user enters the drag area
                        const path = this.utils.eventPath(e);
                        this.dragOver = path.some(v => v.classList && v.classList.contains('index'));
                    }

                    if (e.type === 'drop') {
                        this.dragOver = false;

                        // Upload
                        this.$store.dispatch('upload', {
                            dataTransfer: e.dataTransfer,
                            parent: this.$store.state.location.node
                        });
                    }

                    e.preventDefault();
                }
            );
        }

    };

</script>

<style lang="scss" scoped>

    .upload-area {
        position: absolute;
        @include position(0, 0, 0, 0);
        @include flex(column, center, center);
        background: $palette-snow-white;
        z-index: 200;
        transition: all 0.3s;
        opacity: 0;
        pointer-events: none;

        &.drag-over {
            opacity: 1;
            pointer-events: all;
        }

        i, p {
            color: $palette-deep-purple;
            @include animate('0.5s ease-in-out') {
                from {
                    transform: translateY(0.25em);
                    opacity: 0;
                }
                to {
                    transform: none;
                    opacity: 1;
                }
            }
        }

        i {
            font-size: 4em;
        }

        p {
            @include font(500, 1.5em);
            margin-top: 0.5em;
        }
    }

</style>
