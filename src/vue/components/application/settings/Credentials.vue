<template>
    <section class="credentials">
        <div class="setting">
            <article>
                To change your username and/or password please enter your current one
                to verify it's you.
            </article>

            <div class="input">
                <text-input-field v-model="currentPassword"
                                  :password="true"
                                  placeholder="Current password"/>

                <text-input-field v-model="username"
                                  placeholder="Change Username"/>

                <text-input-field v-model="password"
                                  :password="true"
                                  placeholder="Change Password"/>

                <text-input-field v-show="password"
                                  v-model="passwordRepeat"
                                  :password="true"
                                  placeholder="Repeat New Password"/>

                <div class="actions">
                    <button class="delete-account" @click="deleteAccount">Delete Account</button>
                    <button class="update" @click="update">Update</button>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    // Components
    import TextInputField from '../../../ui/input/TextInputField';

    export default {

        components: {TextInputField},

        data() {
            return {
                currentPassword: '',
                username: '',
                password: '',
                passwordRepeat: ''
            };
        },

        methods: {

            update() {
                const {currentPassword, username, password, passwordRepeat} = this;

                // Validate
                if (password !== passwordRepeat || !password) {

                    // Show error
                    return this.$store.commit('dialogbox/show', {
                        type: 'error',
                        title: 'Passwords are no indentical or empty.',
                        buttons: [
                            {type: 'accept', text: 'Okay'}
                        ]
                    });
                }

                this.$store.dispatch('auth/updateCredentials', {
                    currentPassword,
                    newUsername: username,
                    newPassword: password
                }).then(() => {
                    this.currentPassword = this.username = this.password = this.passwordRepeat = '';
                }).catch(error => {

                    // Show error
                    this.$store.commit('dialogbox/show', {
                        type: 'error',
                        title: 'Failed to update settings',
                        text: error,
                        buttons: [
                            {type: 'accept', text: 'Okay'}
                        ]
                    });
                });
            },

            deleteAccount() {
                const {currentPassword} = this;

                this.$store.dispatch('auth/deleteAccount', {
                    password: currentPassword
                }).then(() => {
                    this.currentPassword = '';
                }).catch(error => {

                    // Show error
                    this.$store.commit('dialogbox/show', {
                        type: 'error',
                        title: 'Failed to delete accound',
                        text: error,
                        buttons: [
                            {type: 'accept', text: 'Okay'}
                        ]
                    });
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .credentials {
        @include flex(column);
    }

    .input {

        .text-input-field {
            width: 100%;

            &:not(:first-child) {
                margin-top: 1.5em;
            }
        }

        .info {
            @include font(600, 0.75em);
            margin-top: 0.25em;
            color: RGB(var(--primary-background-color));
            background: RGB(var(--primary-text-color));
            text-align: center;
            border-radius: 0.15em;
            transition: all 0.3s;

            &:empty {
                opacity: 0;
                padding: 0;
                max-height: 0;
            }

            &:not(:empty) {
                padding: 0.25em 0;
                opacity: 1;
                max-height: 2em;
            }
        }

        .actions {
            @include flex(row, center, space-between);

            button {
                @include font(400, 0.85em);
                margin-top: 1.5em;
                border-radius: 0.15em;
                padding: 0.55em 1.3em 0.6em;
                color: RGB(var(--teritary-text-color));
                transition: all 0.3s;

                &.delete-account {
                    margin-right: 1em;
                    background: RGB(var(--static-error-color));

                    &:hover {
                        filter: brightness(0.9);
                    }
                }

                &.update {
                    background: RGB(var(--theme-primary));

                    &:hover {
                        filter: brightness(0.9);
                    }
                }
            }
        }
    }

</style>
