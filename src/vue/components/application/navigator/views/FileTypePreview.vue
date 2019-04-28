<template>
    <div class="file-type-preview">

        <!-- Fallback if no preview is available -->
        <button @click="$store.dispatch('data/download', {node})">
            Download ({{ node.size | readableByteCount }})
        </button>

    </div>
</template>

<script>

    export default {

        props: {
            node: {type: Object, required: true}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .file-type-preview {
        @include flex(column, center, center);

        > button {
            @include font(600, 0.95em);
            margin: 0 auto;
            background: $palette-asphalt;
            color: $palette-snow-white;
            transition: all 0.3s;
            padding: 0.4em 0.8em 0.45em;
            border-radius: 0.15em;
            width: 100%;

            &:hover {
                background: lighten($palette-asphalt, 5);
            }
        }
    }

</style>
