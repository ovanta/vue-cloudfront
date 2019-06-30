<template>
    <div class="error-log">

        <h1>
            <i class="fas fa-fw fa-exclamation-circle"></i>
            <span>Errors and warnings</span>
        </h1>

        <div :class="{logs: 1, empty: !errors.logs.length}">
            <div v-for="error of errors.logs"
                 :data-type="error.type"
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
        color: #{'rgb(var(--palette-asphalt))'};
        overflow: auto;
        flex-grow: 1;
        min-height: 4em;

        &.empty {
            align-items: center;
            justify-content: center;
        }

        .log {
            @include flex(row);
            border: 1px solid #{'rgba(var(--palette-asphalt), 0.5)'};
            background: #{'rgba(var(--palette-asphalt), 0.025)'};
            font-family: monospace;
            font-size: 0.9em;
            padding: 0.25em 0.5em;
            margin: 0.2em 0;
            border-radius: 0.15em;

            &[data-type='error'] {
                background: rgba($palette-tomatoe-red, 0.04);
                border-color: rgba($palette-tomatoe-red, 0.35);
                color: $palette-tomatoe-red;
            }

            &[data-type='warn'] {
                background: rgba($palette-sunshine-yellow, 0.05);
                border-color: rgba($palette-sunshine-yellow, 0.5);
                color: darken($palette-sunshine-yellow, 20);
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
