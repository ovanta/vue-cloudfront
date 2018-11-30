<template>
    <div class="login">

        <input-field :autofocus="true"
                     class="in"
                     placeholder="Username"
                     @submit="$emit('submit')"
                     @update="setUsername"></input-field>

        <input-field :password="true"
                     class="in"
                     placeholder="Password"
                     @submit="$emit('submit')"
                     @update="setPassword"></input-field>

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
