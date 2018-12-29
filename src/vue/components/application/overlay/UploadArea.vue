<template>
    <overlay :open="dragOver" class="upload-area">
        <i class="fas fa-file-upload"></i>
        <p>Upload</p>
    </overlay>
</template>

<script>

    // Components
    import Overlay from './Overlay';

    export default {
        components: {Overlay},

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

                        // Check if dragged element is supported
                        const {dataTransfer} = e;
                        if ((dataTransfer.items.length && !DataTransferItem.prototype.webkitGetAsEntry && !DataTransferItem.prototype.getAsEntry) &&
                            !dataTransfer.files.length) {
                            return (this.dragOver = false);
                        }

                        // Check if user enters the drag area
                        const path = this.utils.eventPath(e);
                        this.dragOver = path.some(v => v.classList && v.classList.contains('index'));
                    }

                    if (e.type === 'drop') {
                        this.dragOver = false;

                        // Upload
                        this.$store.dispatch('data/upload', {
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
        @include flex(column, center, center);
        z-index: 155;

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
