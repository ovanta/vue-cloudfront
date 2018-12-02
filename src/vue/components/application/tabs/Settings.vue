<template>
    <tab-container title="Settings" class="settings">

        <div slot="content" class="content">


            <!-- Change password -->
            <section class="sec">
                <text-input-field ref="pwdOld"
                                  :password="true"
                                  placeholder="Old password"></text-input-field>
                <text-input-field ref="pwdNew"
                                  :password="true"
                                  placeholder="New password"></text-input-field>
                <text-input-field ref="pwdRepeat"
                                  :password="true"
                                  placeholder="Confirm new password"></text-input-field>

                <button class="confirm" @click="changePassword">Update Password</button>
                <p :class="{info: 1, error: changePasswordError}">{{ changePasswordError || changePasswordSuccess }}</p>
            </section>

            <div class="divider">
                <div></div>
            </div>

            <!-- Change email -->
            <section class="sec">
                <text-input-field ref="unamePwdCur"
                                  :password="true"
                                  placeholder="Current password"></text-input-field>
                <text-input-field ref="unameNew" placeholder="New Username"></text-input-field>
                <text-input-field ref="unameRepeat" placeholder="Repeat Username"></text-input-field>

                <button class="confirm" @click="changeEmail">Change Username</button>
                <p :class="{info: 1, error: changeUsernameError}">{{ changeUsernameError || changeUsernameSuccess }}</p>
            </section>

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
                changePasswordError: '',
                changePasswordSuccess: '',
                changeUsernameError: '',
                changeUsernameSuccess: ''
            };
        },

        methods: {

            changePassword() {
                const {pwdOld, pwdNew, pwdRepeat} = this.$refs;
                this.changePasswordError = '';
                this.changePasswordSuccess = '';

                // Validate
                if (pwdNew.value !== pwdRepeat.value) {
                    return this.changePasswordError = 'New passwords does not match';
                }

                this.$store.dispatch('userdata/changePassword', {
                    currentPassword: pwdOld.value,
                    newPassword: pwdNew.value
                }).catch(error => this.changePasswordError = error).then(() => {
                    [pwdOld, pwdNew, pwdRepeat].forEach(v => v.value = '');
                    this.changePasswordSuccess = 'Password successful changed!';
                });
            },

            changeEmail() {
                const {unamePwdCur, unameNew, unameRepeat} = this.$refs;
                this.changeUsernameError = '';
                this.changeUsernameSuccess = '';

                // Validate
                if (unameNew.value !== unameRepeat.value) {
                    return this.changeUsernameError = 'New usernames does not match';
                }

                this.$store.dispatch('userdata/changeUsername', {
                    currentPassword: unamePwdCur.value,
                    newUsername: unameNew.value
                }).catch(error => this.changeUsernameError = error).then(() => {
                    [unamePwdCur, unameNew, unameRepeat].forEach(v => v.value = '');
                    this.changeUsernameSuccess = 'Username successful changed!';
                });
            }

        }
    };

</script>

<style lang="scss" scoped>

    .settings {

        .content {
            @include flex(row, center, space-evenly);
            flex-grow: 1;
            height: 100%;
        }

        .sec {
            @include flex(column, stretch, flex-end);
            padding: 0 1.75em 1.5em;
            width: 20em;

            .text-input-field {
                margin-top: 1em;
            }

            button {
                margin-top: 3em;
                background: $palette-deep-purple;
                border-radius: 0.15em;
                padding: 0.75em 0;
                color: white;
                font-weight: 600;
                transition: all 0.3s;

                &:hover {
                    background: darken($palette-deep-purple, 5);
                }
            }

            .info {
                @include font(600, 0.75em);
                margin-top: 0.25em;
                color: white;
                background: $palette-deep-blue;
                text-align: center;
                border-radius: 0.15em;
                transition: all 0.3s;

                &.error {
                    background: $palette-tomatoe-red;
                }

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

        .divider {
            @include flex(column, center, center);
            height: 80%;

            &::before,
            &::after {
                display: block;
                @include pseudo(static);
                @include size(1px, 100%);
                background: $palette-decent-blue;
                opacity: 0.5;
            }

            div {
                @include size(11px);
                border-radius: 100%;
                border: 2px solid $palette-decent-blue;
                background: transparent;
                flex-shrink: 0;
                margin: 1em 0;
                opacity: 0.75;
            }
        }
    }

</style>
