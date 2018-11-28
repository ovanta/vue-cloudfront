<template>
    <section class="menu">

        <div class="items">

            <div v-tooltip="'Home'"
                 :class="{'item': 1, active: $store.state.activeTab === 'home'}"
                 @click="changeTab('home')">
                <i class="fas fa-fw fa-home"></i>
            </div>

            <div v-tooltip="'View marked folder and files'"
                 :class="{'item': 1, active: $store.state.activeTab === 'marked'}"
                 @click="changeTab('marked')">
                <i class="fas fa-fw fa-bookmark"></i>
                <intro-box header="Marked Folders and files" text="Mark your important files, folder or just use it as a quick way to access them."></intro-box>
            </div>

            <div v-tooltip="'View history'"
                 :class="{'item': 1, active: $store.state.activeTab === 'history'}"
                 @click="changeTab('history')">
                <i class="fas fa-fw fa-history"></i>
            </div>

            <div v-tooltip="'Terminal'"
                 :class="{'item': 1, active: $store.state.activeTab === 'terminal'}"
                 @click="changeTab('terminal')">
                <i class="fas fa-fw fa-terminal"></i>
            </div>

            <div class="eat-space"></div>

            <div v-tooltip="'Logout'"
                 :class="{'item bottom': 1}"
                 @click="$store.commit('auth/setSessionKey', null)">
                <i class="fas fa-fw fa-sign-out-alt"></i>
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
        background: white;
        box-shadow: 0 0 3px 0 rgba($palette-deep-blue, 0.05);
        border-right: 1px solid rgba($palette-deep-blue, 0.05);
        padding: 1em 0.75em;
    }

    .items {
        @include flex(column, center);
        color: $palette-decent-blue;
        height: 100%;

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

            &.bottom {
                margin: 1.5em 0 0;
            }
        }

        .eat-space {
            flex-grow: 1;
        }
    }

</style>
