<template>
    <div class="login">

        <input-field :autofocus="true"
                     class="in"
                     placeholder="Username"
                     @update="setUsername"
                     @submit="$emit('submit')"></input-field>

        <input-field :password="true"
                     class="in"
                     placeholder="Password"
                     @update="setPassword"
                     @submit="$emit('submit')"></input-field>

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
                password: ''
            };
        },

        methods: {
            setUsername(value) {
                this.username = value;
            },

            setPassword(value) {
                this.password = value;
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

    .login {
        @include flex(column);

        .in {
            margin: 0.25em 0;
        }
    }

</style>
