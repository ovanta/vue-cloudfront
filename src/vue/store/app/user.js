/* eslint-disable no-unused-vars */
export const user = {

    namespaced: true,

    state: {
        introBoxes: {}
    },

    actions: {

        /**
         * Updates the current state
         * @param state
         * @param username Current username
         * @param introBoxes Contains a object where the key is the introBox indentifier
         *        and the value if it's visible.
         */
        async update({state}, {username = null, introBoxes = null}) {

            // Validate
            if (username && (typeof username !== 'string' || username.length < 2 || username.length > 100)) {
                throw `Cannot perform 'update' in settings. username it too short or too long.`;
            }

            if (introBoxes && (typeof introBoxes === 'object')) {
                throw `Cannot perform 'update' in settings. introBoxes isn't a Object.`;
            }

            // Apply
            username && (state.username = username);
            introBoxes && (state.introBoxes = introBoxes);
        },

        /**
         * Responsible for changing the password or username, if this promise
         * gets rejected String is used as error message.
         *
         * @param _
         * @param currentPassword Current password
         * @param newUsername New username (optional)
         * @param newPassword New passoword (optional)
         * @returns {Promise<void>}
         */
        async applySettings({rootState}, {currentPassword, newUsername, newPassword}) {
            return this.dispatch('fetch', {
                route: 'settings',
                body: {
                    apikey: rootState.auth.apikey,
                    currentPassword,
                    newUsername,
                    newPassword
                }
            }).then(() => {

                // Logout
                this.dispatch('auth/logout');
            });
        },

        /**
         * Responsible to delete the accound (and all files)
         *
         * @param rootState
         * @param password - Current password
         * @returns {Promise<void>}
         */
        async deleteAccount({rootState}, {password}) {
            return this.dispatch('fetch', {
                route: 'deleteAccount',
                body: {
                    apikey: rootState.auth.apikey,
                    password
                }
            }).then(() => {

                // Logout
                this.dispatch('auth/logout');
            });
        },

        async showIntroBox({state}, {key, val}) {

            // Apply
            state.introBoxes = {...state.introBoxes, [key]: val};
        },

        async skipIntroBoxes({state}, {key, val}) {

            for (const key in state.introBoxes) {
                state.introBoxes[key] = false;
            }

            // Apply
            state.introBoxes = {...state.introBoxes};
        }

    }
};
