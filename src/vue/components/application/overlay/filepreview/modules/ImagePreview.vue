<template>
    <div :style="{'background-image': `url('${url}')`}"
         class="image-preview"></div>
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
        flex-grow: 1;
        align-self: stretch;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }

</style>
