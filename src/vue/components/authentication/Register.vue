<template>
    <div class="register">

        <input-field :validate="/^[\w\d ]{3,}$/"
                     class="in"
                     placeholder="Username"
                     @update="setUsername"></input-field>

        <input-field :validate="/^(.){6,}$/"
                     :password="true"
                     class="in"
                     placeholder="Password"
                     @update="setPassword"></input-field>

        <input-field :validate="validatePassword"
                     :password="true"
                     class="in"
                     placeholder="Repeat Password"
                     @update="setRepeatedPassword"></input-field>
    </div>
</template>

<script>

    // Components
    import InputField from '../../ui/InputField';

    export default {
        components: {InputField},

        data() {
            return {
                username: '',
                password: '',
                passwordRepeat: ''
            };
        },

        methods: {
            setUsername(value) {
                this.username = value;
            },

            setPassword(value) {
                this.password = value;
            },

            setRepeatedPassword(value) {
                this.passwordRepeat = value;
            },

            validatePassword() {
                return this.password === this.passwordRepeat;
            },

            getFormData() {
                return {
                    username: this.username,
                    password: this.password
                };
            }
        }
    };

</script>

<style lang="scss" scoped>

    .register {
        @include flex(column);

        .in {
            margin: 0.25em 0;
        }
    }

</style>
