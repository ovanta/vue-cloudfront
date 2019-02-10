<template>
    <section class="info-box">

        <!-- Show if the user is currently offline -->
        <p v-if="offline" class="info offline">
            <i class="fas fa-fw fa-unlink"></i>
            <span>No ethernet connection available. Read-only mode active.</span>
        </p>

    </section>
</template>

<script>

    export default {
        data() {
            return {
                offline: !window.navigator.onLine
            };
        },

        mounted() {

            // Detect if the user goes online / offline
            window.addEventListener('online', () => this.offline = false);
            window.addEventListener('offline', () => this.offline = true);
        }
    };

</script>

<style lang="scss" scoped>
    .info-box {
        width: 100%;

        .info {
            @include flex(row, center, center);
            @include font(600, 0.7em);
            padding: 0.4em 0;

            i {
                font-size: 0.8em;
                margin-right: 0.5em;
            }

            &.offline {
                background: $palette-tomatoe-red;
                color: white;
            }
        }
    }
</style>
