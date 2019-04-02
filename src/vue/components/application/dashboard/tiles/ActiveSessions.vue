<template>
    <div v-if="auth.status" class="active-sessions">

        <h1>Active Sessions</h1>

        <div class="sessions-header">
            <span class="country">Country</span>
            <span class="city">City</span>
            <span class="location">Location</span>
            <span class="timestamp">Timestamp</span>
        </div>

        <div class="sessions-body">
            <template v-for="(session, index) of auth.activeSessions">
                <span :class="{country: 1, even: index % 2}">{{ session.country }}</span>
                <span :class="{city: 1, even: index % 2}">{{ session.city }}</span>
                <span :class="{location: 1, even: index % 2}">{{ session.location.latitude | DDToDMS }}N / {{ session.location.longitude | DDToDMS }}E</span>
                <span :class="{timestamp: 1, even: index % 2}">{{ session.registerTimestamp | prettifyTimestamp }}</span>
            </template>
        </div>

    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        filters: {

            DDToDMS(val) {
                const d = Math.floor(val);
                const m = Number((val % 1 * 60).toFixed(2));
                const s = Number((m % 1 * 60).toFixed(2));
                return `${d}° ${m}' ${s}"`;
            },

            prettifyTimestamp(ts) {
                const d = new Date(ts);
                const get = str => String(d[str]()).padStart(2, '0');
                return `${get('getHours')}:${get('getMinutes')}:${get('getSeconds')}`;
            }
        },

        computed: {
            ...mapState(['auth'])
        }
    };

</script>

<style lang="scss" scoped>

    .active-sessions {
        @include flex(column);
        width: 100%;

        h1 {
            @include font(600, 1em);
            margin: 0 0 0.75em 0.5em;
            color: $palette-asphalt;
        }
    }

    .sessions-header,
    .sessions-body {
        display: grid;
        grid-template-columns: 1fr 1fr 3fr 2fr;

        span {
            @include font(600, 0.8em);
            padding: 0.55em 0.5em;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            border: none;

            &.even {
                background: $palette-sick-white;
            }
        }
    }

    .sessions-body{
        overflow: auto;
    }

</style>
