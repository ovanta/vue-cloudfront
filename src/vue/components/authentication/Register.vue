<template>
    <div class="register">

        <input-field :validate="/^[\w\d ]{3,}$/"
                     class="in"
                     placeholder="Username"
                     @update="setUsername"></input-field>

        <input-field :password="true"
                     :validate="/^(.){6,}$/"
                     class="in"
                     placeholder="Password"
                     @update="setPassword"></input-field>

        <input-field :password="true"
                     :validate="validatePassword"
                     class="in"
                     placeholder="Repeat Password"
                     @update="setRepeatedPassword"></input-field>
    </div>
</template>

<script>

    // Components
    import InputField from '../../ui/TextInputField';

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
