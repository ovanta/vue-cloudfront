<template>
    <div v-show="!$store.state.auth.sessionKey"
         :class="{auth: 1, fadein: fadeInActive}"
         @animationend="fadeInActive = false">

        <div class="centered">
            <h1>{{ register ? 'Create an account!' : 'Welcome back!' }}</h1>

            <!-- Username and password input-fields -->
            <div class="input">
                <login v-if="!register"
                       ref="loginBox"
                       class="field"></login>
                <register v-if="register"
                          ref="registerBox"
                          class="field"></register>
            </div>

            <div class="accept">
                <span @click="(fadeInActive = true) && (register = !register)">{{ register ? 'Login' : 'Register' }}</span>
                <button class="apply" @click="submit">{{ register ? 'Create Account' : 'Login' }}</button>
            </div>

        </div>

    </div>
</template>

<script>

    // Components
    import Login from './Login';
    import Register from './Register';

    export default {
        components: {Login, Register},

        data() {
            return {
                register: false,
                error: false,
                fadeInActive: true
            };
        },

        methods: {
            submit() {
                // const type = this.register ? 'register' : 'login';
                // const formData = this.$refs[type + 'Box'].getFormData();
                //
                // switch (type) {
                //     case 'login': {
                //         // TODO: Perform login
                //         break;
                //     }
                //     case 'register': {
                //         // TODO: Perform register
                //         break;
                //     }
                // }
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

        &.fadein .centered {
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

        @include animate('0.5s ease-in-out') {
            from {
                opacity: 0;
            }
            to {
                opacity: 1;
            }
        }
    }

    .centered {

        h1 {
            @include font(200, 2em);
            margin-bottom: 1.5em;
            color: $palette-deep-blue;
            opacity: 0.9;
        }

        .accept {
            @include flex(row, flex-end, space-between);

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

            .apply {
                padding: 0.5em 0.8em 0.55em 0.8em;
                @include font(600, 0.8em);
                background: $palette-deep-purple;
                color: $palette-snow-white;
                margin-top: 2em;
                border-radius: 0.15em;
                transition: all 0.3s;
                float: right;

                &:hover {
                    filter: brightness(1.1);
                }
            }
        }
    }

</style>
