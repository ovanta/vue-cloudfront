<template>
    <section class="menu">

        <div :class="{'item btn-home': 1, active: activeTab === 'home'}" @click="changeTab('home')">
            <i class="fas fa-fw fa-home"></i>
            <span>Home</span>
        </div>

        <div :class="{'item btn-stared': 1, active: activeTab === 'marked'}" @click="changeTab('marked')">
            <i class="fas fa-fw fa-star"></i>
            <span>Bookmarks</span>
        </div>

        <div :class="{'item btn-bin': 1, active: activeTab === 'bin'}" @click="changeTab('bin')">
            <i class="fas fa-fw fa-trash-alt"></i>
            <span>Trash</span>
        </div>

        <div class="eat-space"></div>

        <div class="item bottom btn-refresh" @click="refresh">
            <i class="fas fa-fw fa-sync-alt"></i>
            <span>Refresh</span>
        </div>

        <div class="item bottom btn-logout" @click="$store.dispatch('auth/logout')">
            <i class="fas fa-fw fa-sign-out-alt"></i>
            <span>Logout</span>
        </div>

    </section>
</template>

<script>

    // Components
    import IntroBox from '../../ui/specific/IntroBox';

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
                this.open = false;
            },

            refresh() {

                // Update nodes
                this.$store.dispatch('nodes/update', {keepLocation: true});

                // Go to home
                this.changeTab('home');
                this.open = false;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .menu {
        border-right: 2px solid rgba($palette-asphalt, 0.05);
        @include flex(column);
        padding: 1.75vh 1.15vw;
        height: 100%;
        color: $palette-blurry-gray;
        background: white;
    }

    .item {
        @include flex(row, center);
        width: 100%;
        position: relative;
        padding: 0.65em 0.9em;
        border-radius: 0.25em;
        margin: 0.75vh 0;
        cursor: pointer;
        transition: all 0.25s;

        i {
            transition: all 0.3s;
            font-size: 0.8em;
        }

        span {
            @include font(600, 0.75em);
            margin-left: 0.75em;
            transition: all 0.3s;
        }

        &.active {
            background: $palette-theme-secondary;

            span, i {
                color: white;
            }
        }

        &:not(.active):hover {
            background: rgba($palette-blurry-gray, 0.2);

            span, i {
                color: darken($palette-blurry-gray, 25);
            }
        }
    }

    .eat-space {
        flex-grow: 1;
    }

    @include tablet {
        .menu {
            padding-right: 0;
            padding-left: 0;

            .item {
                border-radius: 0;
            }
        }
    }

    @include mobile {
        .menu {
            @include flex(row, center);
            justify-content: space-between; // Edge fallback
            justify-content: space-evenly;
            height: auto;
            padding: 0 0.5em;
            z-index: 10;

            .eat-space {
                flex-grow: 0;
            }

            .item {
                position: relative;
                margin: 0.5em 0;
                transform: scale(1);
                background: none;
                justify-content: center;

                span {
                    display: none;
                }

                &.active {
                    transform: translateY(-0.2em) scale(1.075);

                    i {
                        color: $palette-theme-primary;
                    }

                    &::before {
                        opacity: 1;

                        @include animate('0.45s ease forwards') {
                            0% {
                                transform: translateY(0.75em) scale(0);
                                opacity: 0;
                            }
                            50% {
                                transform: translateY(0.175em) scale(1);
                            }
                            100% {
                                transform: translateY(0.25em) scale(1);
                                opacity: 1;
                            }
                        }
                    }
                }

                &::before {
                    @include pseudo();
                    @include position(auto, 0, 0, 0);
                    @include size(70%, 6px);
                    margin: auto;
                    background: $palette-theme-primary;
                    transform: translateY(0.75em) scale(0);
                    border-radius: 100em;
                    z-index: -1;
                    opacity: 0;
                }
            }

            @include order(('.btn-logout', '.btn-bin', '.btn-home', '.btn-stared', '.btn-refresh'));
        }
    }

</style>
