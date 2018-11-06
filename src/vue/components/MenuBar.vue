<template>
    <section class="menu">

        <div class="items">

            <div :class="{'item': 1, active: $store.state.activeTab === 'home'}" @click="$store.commit('setActiveTab', 'home')">
                <i class="fas fa-fw fa-home"></i>
            </div>

            <div :class="{'item': 1, active: $store.state.activeTab === 'marked'}">
                <i class="fas fa-fw fa-bookmark" @click="$store.commit('setActiveTab', 'marked')"></i>
                <intro-box header="Marked Folders and files" text="Mark your important files, folder or just use it as a quick way to access them."></intro-box>
            </div>

        </div>

    </section>
</template>

<script>

    export default {
        data() {
            return {};
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
