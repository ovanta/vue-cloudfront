<template>
    <div :class="{auth: 1, visible: !auth.apikey}">

        <div :class="{centered: 1, fadein: fadeAnimationActive, shake: shakeAnimationActive}"
             @animationend="fadeAnimationActive = shakeAnimationActive = false">

            <h1>{{ registerMode ? 'Create an account!' : 'Welcome back!' }}</h1>

            <!-- Username and password input-fields -->
            <div class="input">

                <div v-if="!registerMode" class="field">
                    <text-input-field v-model="username"
                                      :autofocus="!!auth.apikey"
                                      placeholder="Username"
                                      @submit="submit"/>

                    <text-input-field v-model="password"
                                      :password="true"
                                      placeholder="Password"
                                      @submit="submit"/>
                </div>


                <div v-if="registerMode" class="field">
                    <text-input-field v-model="username"
                                      placeholder="Username"
                                      @submit="submit"/>

                    <text-input-field v-model="password"
                                      :password="true"
                                      placeholder="Password"
                                      @submit="submit"/>

                    <text-input-field v-model="passwordRepeat"
                                      :password="true"
                                      placeholder="Repeat Password"
                                      @submit="submit"/>
                </div>

            </div>

            <!-- Error box -->
            <p class="error">{{ errorMsg }}</p>

            <!-- Button bar -->
            <div class="accept">
                <span @click="switchAuthMode">{{ registerMode ? 'Login' : 'Register' }}</span>
                <button @click="submit">{{ registerMode ? 'Create Account' : 'Login' }}</button>
            </div>
        </div>

    </div>
</template>

<script>

    // UI Components
    import TextInputField from '../../ui/input/TextInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {
        components: {TextInputField},

        data() {
            return {
                registerMode: false,
                errorMsg: '',

                username: '',
                password: '',
                passwordRepeat: '',

                fadeAnimationActive: false,
                shakeAnimationActive: false
            };
        },

        computed: {
            ...mapState(['auth'])
        },

        methods: {

            submit() {
                this.registerMode ? this.register() : this.login();
            },

            login() {
                const {username, password} = this;

                this.$store.dispatch('auth/login', {
                    username, password
                }).then(() => {
                    this.password = '';
                    this.passwordRepeat = '';
                }).catch(msg => {
                    this.errorMsg = msg;
                    this.shakeAnimationActive = true;
                });
            },

            register() {
                const {username, password, passwordRepeat} = this;

                // Validate
                if (password !== passwordRepeat) {
                    return;
                }

                this.$store.dispatch('auth/register', {
                    username, password
                }).then(() => {
                    this.password = '';
                    this.passwordRepeat = '';
                }).catch(msg => {
                    this.errorMsg = msg;
                    this.shakeAnimationActive = true;
                });
            },

            switchAuthMode() {
                this.fadeAnimationActive = true;
                this.registerMode = !this.registerMode;
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
        background: #{'rgb(var(--palette-pure-white))'};
        opacity: 0;
        visibility: hidden;
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
            color: #{'rgb(var(--palette-asphalt))'};
            opacity: 0.9;
            text-align: center;
        }

        .error {
            @include font(600, 0.75em);
            color: $palette-tomatoe-red;
            margin-top: 1em;
            height: 1em;
        }

        .field {
            @include flex(column);

            .text-input-field {
                margin: 0.4em 0;
            }
        }

        .accept {
            @include flex(row, flex-end);
            margin-top: 0.75em;

            span {
                font-size: 0.85em;
                text-decoration: underline;
                color: #{'rgb(var(--palette-blurry-gray))'};
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    color: #{'rgb(var(--palette-theme-primary))'};
                }
            }

            button {
                padding: 0.6em 1em 0.65em;
                @include font(600, 0.75em);
                border-radius: 0.15em;
                transition: all 0.3s;
                background: #{'rgb(var(--palette-theme-primary))'};
                color: #{'rgb(var(--palette-snow-white))'};
                margin-left: auto;

                &:hover {
                    filter: brightness(1.1);
                }
            }
        }
    }

    @include mq-phones {
        .centered {
            .accept {

                span {
                    font-size: 0.9em;
                }

                button {
                    padding: 0.7em 1.2em;
                    font-size: 0.8em;
                }
            }
        }
    }

</style>
