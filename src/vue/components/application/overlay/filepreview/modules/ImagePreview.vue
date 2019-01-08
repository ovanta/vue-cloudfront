<template>
    <div class="image-preview">
        <img :src="url" alt="">
    </div>
</template>

<script>

    export default {
        props: {
            url: {
                type: String,
                required: true
            }
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .image-preview {
        @include flex(column, center, center);
        margin: auto;
        flex-grow: 1;
        height: 100%;

        img {
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
            overflow: hidden;
            border-radius: 0.25em;
        }
    }

</style>
