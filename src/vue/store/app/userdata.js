export const userdata = {

    namespaced: true,

    state: {
        username: null,
        introBoxes: {},
        email: null
    },

    actions: {

        setUsername({state}, username) {

            // Validate
            if (typeof username !== 'string' || username.length < 2 || username.length > 100) {
                throw `Cannot perform 'setUsername' in settings. username it too short or too long.`;
            }

            // Apply
            state.username = username;
        },

        setEMail({state}, email) {

            // Validate
            if (typeof email !== 'string' || email.length < 5 || email.length > 320 || !/^[0-9a-zA-Z!#$%&;'*+\-/=?^_`.{|}~]{1,64}@[0-9a-zA-Z]{1,255}\\.[a-zA-Z]{1,10}/.test(email)) {
                throw `Cannot perform 'setEMail' in settings. email has not a valid format.`;
            }

            // Apply
            state.email = email;
        },

        showIntroBox({state}, {key, val}) {

            // Apply
            state.introBoxes = {...state.introBoxes, [key]: val};
        }

    }
};
