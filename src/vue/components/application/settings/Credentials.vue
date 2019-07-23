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
                    <button class="vcf-btn red" @click="deleteAccount">Delete Account</button>
                    <button class="vcf-btn" @click="update">Update</button>
                </div>
            </div>
        </div>

        <div v-if="staticNodes.length" class="setting static-ids">
            <article>
                You currently got {{ staticNodes.length === 1 ? 'one' : staticNodes.length }}
                {{ staticNodes.length === 1 ? 'file' : 'files' }} with public links.
                If you wish you can revoke them all.
            </article>

            <div class="input">
                <button class="vcf-btn red" @click="revokeStaticIds">Revoke all</button>
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

        computed: {

            staticNodes() {
                return this.$store.state.nodes.filter(v => (v.staticIds || []).length);
            }
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
                        text: error.text,
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
                        text: error.text,
                        buttons: [
                            {type: 'accept', text: 'Okay'}
                        ]
                    });
                });
            },

            revokeStaticIds() {
                this.$store.dispatch('nodes/removeStaticIds', {
                    ids: this.staticNodes.reduce((acc, val) => [...acc, ...val.staticIds], [])
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
            margin-top: 0.75em;

            button.delete-account {
                margin-right: 1em;
            }
        }
    }

    .static-ids {
        @include flex(column, flex-end);
    }

</style>
