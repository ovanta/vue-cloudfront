<template>
    <div v-if="auth.status" class="active-sessions no-v-padding">

        <h1>
            <i class="fas fa-fw fa-globe-europe"></i>
            <span>Active Sessions</span>

            <button @click="$store.dispatch('auth/logoutEverywhere')">Logout all</button>
        </h1>

        <!-- Session table -->
        <div class="sessions-header">
            <span class="country">Country</span>
            <span class="city">City</span>
            <span class="browser">Browser</span>
            <span class="timestamp">Timestamp</span>
        </div>

        <div class="sessions-body">
            <template v-for="(session, index) of auth.activeSessions">
                <span :key="session.registerTimestamp" :class="{country: 1, even: index % 2}">{{ session.country }}</span>
                <span :key="session.registerTimestamp" :class="{city: 1, even: index % 2}">{{ session.city }}</span>
                <span :key="session.registerTimestamp" :class="{browser: 1, even: index % 2}">{{ session.device.os.name }} {{ session.device.os.version }} / {{ session.device.browser.name }} {{ session.device.browser.version }}</span>
                <span :key="session.registerTimestamp"
                      :class="{timestamp: 1, even: index % 2}">{{ $utils.formatDate('HH:mm:ss', session.registerTimestamp) }}</span>
            </template>
        </div>

        <!-- Footer -->
        <p class="footer-info">People who login with your credentials will appear here</p>

    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        computed: {
            ...mapState(['auth'])
        }
    };

</script>

<style lang="scss" scoped>

    .active-sessions {
        @include flex(column);
        width: 100%;

        > h1 button {
            margin: 0 0.75em 0 auto;
            @include font(600, 0.75em);
            border-radius: 0.15em;
            background: RGB(var(--primary-text-color));
            color: RGB(var(--primary-background-color));
            padding: 0.6em 0.9em;
            transition: all 0.3s;

            &:hover {
                background: RGB(var(--static-error-color));
            }
        }
    }

    .sessions-header {
        border-bottom: 2px solid RGB(var(--secondary-background-color));
    }

    .sessions-header,
    .sessions-body {
        display: grid;
        grid-template-columns: 1.5fr 1.5fr 3fr 1.5fr;
        color: RGB(var(--primary-text-color));

        span {
            @include font(600, 0.8em);
            @include white-space-overflow;
            padding: 0.55em 0.5em;
            min-width: 0;
            text-align: left;
            border: none;

            &.even {
                background: RGB(var(--secondary-background-color));
            }

            &.country {
                padding-left: 1.5em;
            }

            &.timestamp {
                padding-right: 1.5em;
            }

            &.city,
            &.browser,
            &.timestamp {
                color: RGBA(var(--primary-text-color), 0.85);
            }
        }
    }

    .sessions-body {
        overflow: auto;
        padding-bottom: 0.5em;
    }

    .footer-info {
        margin-top: auto;
        text-align: center;
        color: RGBA(var(--primary-text-color), 0.5);
        @include font(600, 0.7em);
        transition: all 0.3s;

        &:hover {
            color: RGBA(var(--primary-text-color), 0.85);
        }
    }

    @include mq-phones {
        .sessions-header,
        .sessions-body {
            grid-template-columns: 1fr 2fr 1fr;

            span.city {
                display: none;
            }
        }
    }

</style>
