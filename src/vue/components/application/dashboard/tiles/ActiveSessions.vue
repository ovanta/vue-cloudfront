<template>
    <div v-if="auth.status" class="active-sessions">

        <h1>Active Sessions</h1>

        <table class="sessions">
            <thead>
                <tr>
                    <th class="country">Country</th>
                    <th class="city">City</th>
                    <th class="location">Location</th>
                    <th class="timestamp">Timestamp</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="session of auth.status.activeSessions">
                    <td class="country">{{ session.country }}</td>
                    <td class="city">{{ session.city }}</td>
                    <td class="location">{{ session.location.latitude | DDToDMS }}N / {{ session.location.longitude | DDToDMS }}E</td>
                    <td class="timestamp">{{ session.registerTimestamp | prettifyTimestamp }}</td>
                </tr>
            </tbody>
        </table>

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
            margin: 0 0 0.75em;
            color: $palette-asphalt;
        }
    }

    .sessions {
        table-layout: fixed;
        border-collapse: collapse;
        width: 100%;
        color: $palette-asphalt;

        th,
        td {
            @include font(600, 0.8em);
            padding: 0.55em 0.5em;
            min-width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            border: none;

            &.country {
                width: 18%;
            }

            &.city {
                width: 18%;
            }

            &.location {
                width: 44%;
            }

            &.timestamp {
                width: 20%;
            }
        }

        th {
            font-size: 0.8em;
            padding-bottom: 0.75em;
            border-bottom: 2px solid $palette-sick-white;
        }

        tbody tr {

            &:first-child td {
                padding-top: 0.75em;
            }

            &:nth-child(even) {
                background: $palette-sick-white;
            }
        }
    }

</style>
