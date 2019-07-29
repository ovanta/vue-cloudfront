<template>
    <audio controls class="audio-preview">
        <source :src="url">
    </audio>
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

    .audio-preview {
        @include flex(row, center, space-between);
        position: relative;
        width: 90%;
        max-width: 25em;
    }

    @include mq-phones {
        .audio-preview {
            width: 100%;
        }
    }

</style>
