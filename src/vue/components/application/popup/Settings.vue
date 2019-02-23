<template>
    <popup store-prop="Settings"
           title="Settings"
           class="settings">
        <div class="content">
            <text-input-field ref="currentPassword"
                              :password="true"
                              placeholder="Current password"/>

            <text-input-field ref="newUsername"
                              placeholder="Change Username"/>

            <text-input-field ref="newPassword"
                              :password="true"
                              placeholder="Change Password"/>

            <text-input-field ref="newPasswordRepeat"
                              :password="true"
                              placeholder="Repeat New Password"/>


            <p class="error">{{ errorMsg }}</p>

            <div class="actions">
                <button class="delete-account" @click="deleteAccount">Delete Account</button>
                <button class="update" @click="update">Update</button>
            </div>
        </div>
    </popup>
</template>

<script>

    // Components
    import TextInputField from '../../../ui/input/TextInputField';
    import Popup          from './Popup';

    export default {

        components: {Popup, TextInputField},

        data() {
            return {
                errorMsg: ''
            };
        },

        methods: {

            update() {
                const {currentPassword, newUsername, newPassword, newPasswordRepeat} = this.$refs;
                this.errorMsg = '';

                // Validate
                if (newPassword.value !== newPasswordRepeat.value) {
                    this.errorMsg = 'Passwords are not indentical';
                    return;
                }

                this.$store.dispatch('auth/applySettings', {
                    currentPassword: currentPassword.value,
                    newUsername: newUsername.value,
                    newPassword: newPassword.value
                }).then(() => {
                    [currentPassword, newUsername, newPassword, newPasswordRepeat].forEach(v => v.clear());
                }).catch(error => {
                    this.errorMsg = error;
                });
            },

            deleteAccount() {
                const {currentPassword} = this.$refs;
                this.errorMsg = '';

                this.$store.dispatch('auth/deleteAccount', {
                    password: currentPassword.value
                }).then(() => {
                    currentPassword.clear();
                }).catch(error => {
                    this.errorMsg = error;
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .settings {

        .content {
            @include flex(column, stretch, stretch);
        }

        .text-input-field {
            margin-top: 1.5em;
        }

        .error {
            @include font(600, 0.75em);
            color: $palette-tomatoe-red;
            margin-top: 1.5em;
        }

        .info {
            @include font(600, 0.75em);
            margin-top: 0.25em;
            color: white;
            background: $palette-deep-blue;
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
    }

    .actions {
        @include flex(row, center, space-between);

        button {
            @include font(400, 0.85em);
            margin-top: 1.5em;
            border-radius: 0.15em;
            padding: 0.55em 1.3em 0.6em;
            color: white;
            transition: all 0.3s;

            &.delete-account {
                background: $palette-tomatoe-red;
                margin-right: 1em;

                &:hover {
                    background: darken($palette-tomatoe-red, 3);
                }
            }

            &.update {
                background: $palette-theme-primary;

                &:hover {
                    background: darken($palette-theme-primary, 3);
                }
            }
        }
    }

</style>
