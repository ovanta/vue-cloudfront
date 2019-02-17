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
        position: relative;
        margin: auto;
        width: 100%;
        flex-grow: 1;
        height: 15em;

        img {
            position: absolute;
            @include position(0, 0, 0, 0);
            margin: auto;
            max-height: 100%;
            max-width: 100%;
            object-fit: contain;
            background: $pattern-transparency repeat;
            background-size: 10px;
            border-radius: 0.25em;
        }
    }

</style>
