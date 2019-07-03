<template>
    <section class="info-box">

        <!-- Show if the user is currently offline -->
        <p v-if="!connection.ethernet" class="info offline">
            <i class="fas fa-fw fa-unlink"></i>
            <span>No ethernet connection available. Read-only mode active.</span>
        </p>

        <!-- Show if connected via webscket -->
        <p v-if="!connection.socketRegistered" class="info offline">
            <i class="fas fa-fw fa-unlink"></i>
            <span>Socket not connected.</span>
        </p>

    </section>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            return {};
        },

        computed: {
            ...mapState(['connection'])
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
                background: RGB(var(--static-tomato-red));
                color: RGB(var(--primary-background-color));
            }
        }
    }
</style>
