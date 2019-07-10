<template>
    <div class="error-log">

        <h1>
            <i class="fas fa-fw fa-exclamation-circle"></i>
            <span>Errors and warnings</span>
        </h1>

        <div :class="{logs: 1, empty: !errors.logs.length}">
            <div v-for="error of errors.logs"
                 :data-type="error.type"
                 :key="error.data"
                 class="log">
                <span v-if="error.type === 'error'">🗙</span>
                <span v-else-if="error.type === 'warn'">⚠</span>
                <p class="content"> {{ error.data.length === 1 ? error.data[0] : JSON.stringify(error.data) }}</p>
            </div>

            <p v-if="!errors.logs.length">Everything's fine <i class="far fa-fw fa-smile-beam"></i></p>
        </div>

    </div>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            return {};
        },

        computed: {
            ...mapState(['errors'])
        }
    };

</script>

<style lang="scss" scoped>

    .error-log {
        @include flex(column);
    }

    .logs {
        @include flex(column);
        color: RGB(var(--primary-text-color));
        overflow: auto;
        flex-grow: 1;
        min-height: 4em;

        &.empty {
            align-items: center;
            justify-content: center;
        }

        .log {
            @include flex(row);
            border: 1px solid RGBA(var(--primary-text-color), 0.5);
            background: RGBA(var(--primary-text-color), 0.025);
            font-family: monospace;
            font-size: 0.9em;
            padding: 0.25em 0.5em;
            margin: 0.2em 0;
            border-radius: 0.15em;

            &[data-type='error'] {
                background: RGBA(var(--static-error-color), 0.04);
                border-color: RGBA(var(--static-error-color), 0.35);
                color: RGB(var(--static-error-color));
            }

            &[data-type='warn'] {
                background: RGBA(var(--static-warning-color), 0.05);
                border-color: RGBA(var(--static-warning-color), 0.5);
                color: RGB(var(--static-warning-color));
            }

            > span {
                margin-right: 0.5em;
            }
        }

        > p {
            @include font(600, 0.9em);
            text-align: center;

            i {
                font-size: 1em;
            }
        }
    }

</style>
