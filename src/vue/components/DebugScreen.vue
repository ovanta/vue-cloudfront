<template>
    <div :class="{'debug-screen': 1, open: $store.state.showDebugScreen}">

        <div class="header">
            <h1>Debug</h1>
            <i class="fas fa-times-circle" @click="$store.commit('showDebugScreen', false)"></i>
        </div>


        <!-- Debug info -->
        <div class="info">
            <div class="stat" v-for="stat of stats">
                <span>{{ stat.name }}:</span>
                <b>{{ stat.value }}</b>
            </div>
        </div>

    </div>
</template>

<script>

    export default {

        computed: {
            stats() {
                const state = this.$store.state;
                return [
                    {name: 'Nodes', value: state.nodes.length},
                    {name: 'Clipboard', value: state.clipboard.nodes.length},
                    {name: 'Selection', value: state.selection.length},
                    {name: 'Editable', value: !!state.editable.node},
                    {name: 'Search', value: state.search.nodes.length}
                ];
            }
        },

        data() {
            return {
                visible: false
            };
        },

        mounted() {
            this.$on('show', () => this.visible = true);
            this.$on('hide', () => this.visible = false);
            this.$on('toggle', () => this.visible = !this.visible);
        }

    };

</script>

<style lang="scss" scoped>

    .debug-screen {
        position: absolute;
        @include position(auto, auto, 0, 0);
        z-index: 15;
        background: #000;
        padding: 0.75em 1em;
        border: 2px solid rgba($palette-deep-blue, 0.1);
        border-width: 1px 1px 0 0;
        font-family: monospace;
        font-size: 0.9em;
        border-top-right-radius: 0.5em;
        transform: translateY(110%);
        transform-origin: bottom left;
        transition: all 0.3s;
        color: white;

        &.open {
            transform: none;
        }
    }

    .header {
        @include flex(center);
        padding-bottom: 0.25em;

        i {
            margin-left: auto;
            font-size: 0.95em;
            margin-top: 0.2em;
            cursor: pointer;
        }

        h1 {
            font-size: 1.35em;
        }
    }

    .stat {
        @include flex(row);

        b {
            margin-left: auto;
            min-width: 4em;
            text-align: right;
        }
    }

</style>
