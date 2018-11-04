<template>
    <section class="menu">

        <div class="items">

            <div :class="{'item': 1, active: !$store.state.showStarredNodes}" @click="$store.commit('showStarredNodes', false)">
                <i class="fas fa-fw fa-home"></i>
            </div>

            <div :class="{'item': 1, active: $store.state.showStarredNodes}">
                <i class="fas fa-fw fa-star" @click="$store.commit('showStarredNodes', true)"></i>
            </div>

        </div>

    </section>
</template>

<script>

    export default {
        data() {
            return {
                open: false
            };
        }
    };

</script>

<style lang="scss" scoped>

    .menu {
        position: relative;
        background: white;
        box-shadow: 0 0 3px 0 rgba($palette-deep-blue, 0.05);
        border-right: 1px solid rgba($palette-deep-blue, 0.05);
        z-index: 10;
        padding: 1em 0.75em;
    }

    .items {
        @include flex(column, center);
        color: $palette-decent-blue;

        .item {
            margin-bottom: 1.5em;
            border-radius: 100%;
            padding: 0.5em;
            cursor: pointer;
            transition: all 0.3s;

            &.active {
                background: rgba($palette-deep-purple, 0.08);

                i {
                    color: $palette-deep-purple;
                }
            }

            i {
                transition: all 0.3s;
                font-size: 1em;
            }
        }
    }

</style>
