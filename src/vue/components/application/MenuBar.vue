<template>
    <section class="menu">

        <div class="items">

            <div :class="{'item': 1, active: $store.state.activeTab === 'home'}" @click="changeTab('home')">
                <i class="fas fa-fw fa-home"></i>
            </div>

            <div :class="{'item': 1, active: $store.state.activeTab === 'marked'}">
                <i class="fas fa-fw fa-bookmark" @click="changeTab('marked')"></i>
                <intro-box header="Marked Folders and files" text="Mark your important files, folder or just use it as a quick way to access them."></intro-box>
            </div>

            <div :class="{'item': 1, active: $store.state.activeTab === 'history'}">
                <i class="fas fa-fw fa-history" @click="changeTab('history')"></i>
            </div>

        </div>

    </section>
</template>

<script>

    // Components
    import IntroBox from '../../ui/IntroBox';

    export default {

        components: {IntroBox},

        data() {
            return {};
        },

        methods: {

            changeTab(newTab) {

                // Clear selection
                this.$store.commit('selection/clear');

                // Show new tab
                this.$store.commit('setActiveTab', newTab);
            }

        }

    };

</script>

<style lang="scss" scoped>

    .menu {
        position: relative;
        background: white;
        box-shadow: 0 0 3px 0 rgba($palette-deep-blue, 0.05);
        border-right: 1px solid rgba($palette-deep-blue, 0.05);
        padding: 1em 0.75em;
    }

    .items {
        @include flex(column, center);
        color: $palette-decent-blue;

        .item {
            position: relative;
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
