<template>
    <tab-container class="settings" title="Settings">

        <div slot="content" class="content">


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

            <button class="confirm" @click="update">Update</button>

        </div>

    </tab-container>
</template>

<script>

    // Components
    import TextInputField from '../../../ui/TextInputField';
    import TabContainer   from '../TabContainer';

    export default {

        components: {TextInputField, TabContainer},

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

                this.$store.dispatch('userdata/applySettings', {
                    currentPassword: currentPassword.value,
                    newUsername: newUsername.value,
                    newPassword: newPassword.value
                }).then(() => {
                    [currentPassword, newUsername, newPassword, newPasswordRepeat].forEach(v => v.clear());
                }).catch(error => {
                    this.errorMsg = error;
                });
            }

        }
    };

</script>

<style lang="scss" scoped>

    .settings {
        @include flex(column, center, center);

        .content {
            @include flex(column, stretch, flex-end);
            padding: 0 1.75em 1.5em;
            width: 20em;
            margin: auto;

            .text-input-field {
                margin-top: 1.5em;
            }

            button {
                @include font(400, 0.9em);
                margin-top: 1.5em;
                margin-left: auto;
                background: $palette-deep-purple;
                border-radius: 0.15em;
                padding: 0.55em 1.3em;
                color: white;
                transition: all 0.3s;

                &:hover {
                    background: darken($palette-deep-purple, 5);
                }
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


    }

</style>
