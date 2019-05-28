<template>
    <section class="menu-bar">

        <div v-if="auth.status" class="header">
            <h1>
                <span>Hello {{ auth.status.user.username }}</span>
                <i class="fas fa-fw fa-hand-peace"></i>
            </h1>

            <div class="store-info">
                <circle-progress-bar :value="$store.getters['nodes/totalSize'] / auth.status.availableSpace" :stroke-width="1.15"/>

                <div class="summary">
                    <p>{{ $store.getters['nodes/totalSize'] | readableByteCount }}</p>
                    <span></span>
                    <p>{{ auth.status.availableSpace | readableByteCount }}</p>
                </div>
            </div>
        </div>

        <button :class="{'item btn-dashboard': 1, active: activeTab === 'dashboard'}" @click="changeTab('dashboard')">
            <i class="fas fa-fw fa-tachometer-alt"></i>
            <span>Dashboard</span>
        </button>

        <button :class="{'item btn-home': 1, active: activeTab === 'home'}" @click="changeTab('home')">
            <i class="fas fa-fw fa-home"></i>
            <span>Home</span>
        </button>

        <button :class="{'item btn-stared': 1, active: activeTab === 'marked'}" @click="changeTab('marked')">
            <i class="fas fa-fw fa-star"></i>
            <span>Starred</span>
        </button>

        <button :class="{'item btn-bin': 1, active: activeTab === 'bin'}" @click="changeTab('bin')">
            <i class="fas fa-fw fa-trash-alt"></i>
            <span>Trash</span>
        </button>

        <div class="eat-space"></div>

        <button class="item bottom btn-refresh" @click="refresh">
            <i class="fas fa-fw fa-sync-alt"></i>
            <span>Refresh</span>
        </button>

        <button class="item bottom btn-logout" @click="$store.dispatch('auth/logout')">
            <i class="fas fa-fw fa-sign-out-alt"></i>
            <span>Logout</span>
        </button>

    </section>
</template>

<script>

    // Components
    import IntroBox          from '../../ui/specific/IntroBox';
    import CircleProgressBar from '../../ui/loaders/CircleProgressBar';

    // Vue stuff
    import {mapState} from 'vuex';

    export default {

        components: {IntroBox, CircleProgressBar},

        data() {
            return {
                status: {}
            };
        },

        computed: {
            ...mapState(['activeTab', 'auth'])
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

    .menu-bar {
        border-right: 2px solid $palette-sick-white;
        @include flex(column);
        padding: 1.75vh 1.15vw;
        height: 100%;
        background: white;
    }

    .header {
        margin: 0.75em auto 2.5vh;
        padding-bottom: 2.5vh;
        border-bottom: 2px solid $palette-sick-white;
        color: $palette-blurry-gray;

        h1 {
            @include font(600, 0.9em);
            @include flex(row, center, center);
            margin-bottom: 1.5em;

            i {
                font-size: 0.75em;
                margin-left: 0.4em;
            }
        }

        .store-info {
            @include flex(column, center, center);
            position: relative;
            width: 100%;

            .circle-progress-bar {
                @include size(6.5em);
            }

            .summary {
                position: absolute;
                @include position(0, 0, 0, 0);
                @include flex(column, center, center);

                span {
                    display: inline-block;
                    @include size(1px, 20%);
                    background: $palette-decent-blue;
                    margin: 0.35em 0;
                }

                p {
                    @include font(600, 0.8em);
                    color: $palette-decent-blue;
                }
            }
        }
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
        color: $palette-blurry-gray;

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

    @include mq-tablets {
        .menu-bar {
            padding-right: 0;
            padding-left: 0;

            .item {
                border-radius: 0;
            }
        }
    }

    @include mq-phones {
        .menu-bar {
            @include flex(row, center);
            justify-content: space-between; // Edge fallback
            justify-content: space-evenly;
            height: auto;
            padding: 0 0.5em;
            z-index: 3;
            background: white;
            border-top: 2px solid $palette-snow-white;

            .eat-space {
                flex-grow: 0;
            }

            .header {
                display: none;
            }

            .item {
                position: relative;
                margin: 0.5em 0;
                transform: scale(1);
                background: none;
                justify-content: center;
                font-size: 1.075em;

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
                    @include size(6px, 60%);
                    margin: auto;
                    background: $palette-theme-primary;
                    transform: translateY(0.75em) scale(0);
                    border-radius: 100em;
                    z-index: -1;
                    opacity: 0;
                }
            }

            @include order(('.btn-logout', '.btn-bin', '.btn-home', '.btn-dashboard', '.btn-stared', '.btn-refresh'));
        }
    }

</style>
