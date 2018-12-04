<template>
    <div :class="{auth: 1, visible: !$store.state.auth.sessionKey}">

        <div :class="{centered: 1, fadein: fadeAnimationActive, shake: shakeAnimationActive}"
             @animationend="fadeAnimationActive = shakeAnimationActive = false">

            <h1>{{ register ? 'Create an account!' : 'Welcome back!' }}</h1>

            <!-- Username and password input-fields -->
            <div class="input">

                <login v-if="!register"
                       ref="loginBox"
                       class="field"
                       @submit="submit"></login>

                <register v-if="register"
                          ref="registerBox"
                          class="field"></register>

            </div>

            <div class="accept">
                <span @click="(fadeAnimationActive = true) && (register = !register)">{{ register ? 'Login' : 'Register' }}</span>

                <button v-tooltip="'Get a impression of how it would look'"
                        class="demo"
                        @click="demo">Show Demo
                </button>

                <button class="apply" @click="submit">{{ register ? 'Create Account' : 'Login' }}</button>
            </div>
        </div>

    </div>
</template>

<script>

    // Components
    import Login    from './Login';
    import Register from './Register';

    export default {
        components: {Login, Register},

        data() {
            return {
                register: false,
                error: false,

                fadeAnimationActive: false,
                shakeAnimationActive: false
            };
        },

        methods: {
            submit() {
                const type = this.register ? 'register' : 'login';
                const credentials = this.$refs[type + 'Box'].getFormData();

                this.$store.dispatch('auth/auth', {type, credentials}).catch(() => {
                    this.shakeAnimationActive = true;
                });
            },

            demo() {
                this.$store.commit('auth/update', {
                    userName: 'Demo'
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .auth {
        position: absolute;
        @include flex(column, center, center);
        @include position(0, 0, 0, 0);
        z-index: 100;
        background: white;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.5s;

        &.visible {
            opacity: 1;
            visibility: visible;
            pointer-events: all;
        }
    }

    .centered {

        &.fadein {
            @include animate('0.5s ease-in-out') {
                from {
                    opacity: 0;
                    transform: translateY(0.5em);
                }
                to {
                    opacity: 1;
                    transform: none;
                }
            }
        }

        &.shake {
            @include animate('1s linear') {
                10%, 90% {
                    transform: translate3d(-1px, 0, 0);
                }
                20%, 80% {
                    transform: translate3d(2px, 0, 0);
                }
                30%, 50%, 70% {
                    filter: grayscale(1);
                    transform: translate3d(-4px, 0, 0);
                }
                40%, 60% {
                    transform: translate3d(4px, 0, 0);
                }
            }
        }

        h1 {
            @include font(200, 2em);
            margin-bottom: 1em;
            color: $palette-deep-blue;
            opacity: 0.9;
            text-align: center;
        }

        .accept {
            @include flex(row, flex-end);
            margin-top: 2em;

            span {
                font-size: 0.85em;
                text-decoration: underline;
                color: $palette-decent-blue;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    color: $palette-deep-purple;
                }
            }

            .demo,
            .apply {
                padding: 0.5em 0.8em 0.55em 0.8em;
                @include font(600, 0.75em);
                border-radius: 0.15em;
                transition: all 0.3s;
                color: $palette-snow-white;

                &:hover {
                    filter: brightness(1.1);
                }
            }

            .demo {
                background: $palette-happy-pink;
                margin: 0 0.5em 0 auto;
            }

            .apply {
                background: $palette-deep-purple;
            }
        }
    }

</style>
