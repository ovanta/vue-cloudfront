<template>
    <section class="menu">

        <div class="items">

            <div v-tooltip="'Home'"
                 :class="{'item': 1, active: activeTab === 'home'}"
                 @click="changeTab('home')">
                <i class="fas fa-fw fa-home"></i>
            </div>

            <div v-tooltip="'View marked folder and files'"
                 :class="{'item': 1, active: activeTab === 'marked'}"
                 @click="changeTab('marked')">
                <i class="fas fa-fw fa-bookmark"></i>
                <intro-box id="0"
                           header="Marked Folders and files"
                           text="Mark your important files, folder or just use it as a quick way to access them."/>
            </div>

            <div v-tooltip="'View history'"
                 :class="{'item': 1, active: activeTab === 'history'}"
                 @click="changeTab('history')">
                <i class="fas fa-fw fa-history"></i>
            </div>


            <div class="eat-space"></div>

            <div v-tooltip="'Refresh'"
                 class="item bottom"
                 @click="refresh()">
                <i class="fas fa-fw fa-sync-alt"></i>
            </div>

            <div v-tooltip="'User settings'"
                 :class="{'item bottom': 1, active: activeTab === 'settings'}"
                 @click="changeTab('settings')">
                <i class="fas fa-fw fa-cog"></i>
            </div>

            <div v-tooltip="'Logout'"
                 class="item bottom"
                 @click="$store.dispatch('auth/logout')">
                <i class="fas fa-fw fa-sign-out-alt"></i>
            </div>

        </div>

    </section>
</template>

<script>

    // Components
    import IntroBox from '../../ui/IntroBox';

    // Vue stuff
    import {mapState} from 'vuex';

    export default {

        components: {IntroBox},

        data() {
            return {};
        },

        computed: {
            ...mapState(['activeTab'])
        },

        methods: {

            changeTab(newTab) {

                // Clear selection
                this.$store.commit('selection/clear');

                // Show new tab
                this.$store.commit('setActiveTab', newTab);
            },

            refresh() {

                // Update nodes
                this.$store.dispatch('nodes/update');

                // Go to home
                this.changeTab('home');
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
            @include flex(column, center, center);
            @include size(2.5em);
            position: relative;
            margin-bottom: 1em;
            cursor: pointer;
            transition: all 0.3s;

            &.active i {
                color: $palette-deep-purple;;
            }

            i {
                transition: all 0.3s;
                font-size: 1em;
            }

            &.bottom {
                margin: 1em 0 0;
            }
        }

        .eat-space {
            flex-grow: 1;
        }
    }

</style>
