<template>
    <object :data="url"
            type="application/pdf"
            width="100%"
            height="100%">
    </object>
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
