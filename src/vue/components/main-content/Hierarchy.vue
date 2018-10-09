<template>
    <section class="hierarchy">

        <div class="node" v-for="(node, index) of nodes">
            <span class="name" @click="$store.commit('location/update', node.hash)">{{ node.name }}</span>
            <i class="material-icons" v-if="index < nodes.length - 1">keyboard_arrow_right</i>
        </div>

    </section>
</template>

<script>

    export default {

        computed: {
            nodes() {
                return this.$store.state.location.map(
                    n => this.$store.state.nodes.find(sn => sn.hash === n)
                );
            }
        },

        data() {
            return {};
        }

    };

</script>

<style lang="scss" scoped>


    .hierarchy {

        .node {
            @include inline-flex(row, center);
            color: rgba($palette-deep-blue, 0.8);

            .name {
                position: relative;
                cursor: pointer;
                transition: all 0.3s;
                padding: 0.2em 0.5em;
                border-radius: 0.1em;

                &:hover {
                    background: rgba($palette-deep-blue, 0.04);
                }

            }

            i {
                margin: 0 0.1em;
                opacity: 0.75;
            }
        }
    }

</style>
