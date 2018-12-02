/* eslint-disable no-unused-vars */
export const userdata = {

    namespaced: true,

    state: {
        username: null,
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
         * Responsible for changing of a password, if this promise
         * gets rejected String is used as error message.
         * @param state
         * @param currentPassword Current password for authentication
         * @param newPassword New password
         */
        async changePassword({state}, {currentPassword, newPassword}) {
            // Validate and apply
        },

        /**
         * Responsible for changing the username, if this promise
         * gets rejected String is used as error message.
         * @param state
         * @param currentPassword Current password for authentication
         * @param newUsername New username
         */
        async changeUsername({state}, {currentPassword, newUsername}) {
            // Validate and apply
        },

        async showIntroBox({state}, {key, val}) {

            // Apply
            state.introBoxes = {...state.introBoxes, [key]: val};
        }

    }
};
