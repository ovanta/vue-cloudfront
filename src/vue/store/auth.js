export const auth = {

    namespaced: true,

    state: {

        /**
         * Session-key which can an and should be used to fetch data or perform actions.<
         * Is used in the nodes store module.
         */
        sessionKey: null,

        // Defines mode, currently there are only 'normal' and 'demo'
        userMode: 'normal'
    },

    mutations: {

        /**
         * Updates the current authentication state
         *
         * @param state
         * @param key New "SessionKey"
         * @param mode Usermode, is used to change UI components and behaviour
         * @returns {Promise<void>}
         */
        update(state, {key, mode}) {

            // Validate usermode
            if (!['normal', 'demo'].includes(mode)) {
                throw `Cannot perform 'update' in mutations. newMode can only be 'normal' or 'demo'`;
            }

            // Set key and usermode
            state.sessionKey = key;
            state.userMode = mode;
        }

    },

    actions: {

        /**
         * Authenticates a user
         * @param _
         * @param type 'register' or 'login'
         * @param credentials username, password and so on.
         */
        async auth(_, {type, credentials}) {

            // Validate
            if (typeof type !== 'string' || !['login', 'register'].includes(type)) {
                throw `Cannot perform 'auth' in nodes. type isn't a string and can only be 'login' or 'register.'`;
            }

            if (typeof credentials !== 'object' || typeof credentials.username !== 'string' || typeof credentials.password !== 'string') {
                throw `Cannot perform 'auth' in nodes. credentials needs a 'username' and 'password' prop.`;
            }

            // TODO: Make ajax request and get a session key
            return Promise.reject();
        }
    }
};
