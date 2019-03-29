<template>
    <div :class="{auth: 1, visible: !auth.apikey}">

        <div :class="{centered: 1, fadein: fadeAnimationActive, shake: shakeAnimationActive}"
             @animationend="fadeAnimationActive = shakeAnimationActive = false">

            <h1>{{ registerMode ? 'Create an account!' : 'Welcome back!' }}</h1>

            <!-- Username and password input-fields -->
            <div class="input">

                <div v-if="!registerMode" class="field">
                    <text-input-field ref="loginUsername"
                                      :autofocus="!!auth.apikey"
                                      placeholder="Username"
                                      @submit="submit"/>

                    <text-input-field ref="loginPassword"
                                      :password="true"
                                      placeholder="Password"
                                      @submit="submit"/>
                </div>


                <div v-if="registerMode" class="field">
                    <text-input-field ref="registerUsername"
                                      placeholder="Username"
                                      @submit="submit"/>

                    <text-input-field ref="registerPassword"
                                      :password="true"
                                      placeholder="Password"
                                      @submit="submit"/>

                    <text-input-field ref="registerPasswordRepeat"
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
                const {loginUsername, loginPassword} = this.$refs;
                this.errorMsg = '';

                this.$store.dispatch('auth/login', {
                    username: loginUsername.value,
                    password: loginPassword.value
                }).then(() => {
                    [loginUsername, loginPassword].forEach(v => v.clear());
                }).catch(msg => {
                    this.errorMsg = msg;
                    this.shakeAnimationActive = true;
                });
            },

            register() {
                const {registerUsername, registerPassword, registerPasswordRepeat} = this.$refs;
                this.errorMsg = '';

                // Validate
                if (registerPassword.value !== registerPasswordRepeat.value) {
                    this.errorMsg = 'Passwords are not indentical';
                    return;
                }

                this.$store.dispatch('auth/register', {
                    username: registerUsername.value,
                    password: registerPassword.value
                }).then(() => {
                    [registerUsername, registerPassword, registerPasswordRepeat].forEach(v => v.clear());
                }).catch(msg => {
                    this.errorMsg = msg;
                    this.shakeAnimationActive = true;
                });
            },

            switchAuthMode() {
                this.errorMsg = '';
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
        background: white;
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
            color: $palette-asphalt;
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
                color: $palette-decent-blue;
                cursor: pointer;
                transition: all 0.3s;

                &:hover {
                    color: $palette-theme-primary;
                }
            }

            button {
                padding: 0.6em 1em 0.65em;
                @include font(600, 0.75em);
                border-radius: 0.15em;
                transition: all 0.3s;
                background: $palette-theme-primary;
                box-shadow: 0 0.05em 0.3em rgba($palette-theme-primary, 0.25);
                color: $palette-snow-white;
                margin-left: auto;

                &:hover {
                    box-shadow: 0 0.05em 0.5em rgba($palette-theme-primary, 0.5);
                    filter: brightness(1.1);
                }
            }
        }
    }

    @include mobile {
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
