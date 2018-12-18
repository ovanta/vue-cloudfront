<template>
    <div class="register">

        <input-field class="in"
                     placeholder="Username"
                     @update="setUsername"/>

        <input-field :password="true"
                     class="in"
                     placeholder="Password"
                     @update="setPassword"/>

        <input-field :password="true"
                     class="in"
                     placeholder="Repeat Password"
                     @update="setRepeatedPassword"/>
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
