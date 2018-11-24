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

        // Sets a new session key
        async setSessionKey(state, newKey) {

            // Validate
            if (!(typeof newKey !== 'string')) {
                throw `Cannot perform 'setSessionKey' in mutations. newKey isn't a String.`;
            }

            // Set key
            state.sessionKey = newKey;
        },

        async setUserMode(state, newMode) {

            // Validate
            if (!['normal', 'demo'].includes(newMode)) {
                throw `Cannot perform 'setSessionKey' in mutations. newMode can only be 'normal' or 'demo'`;
            }

            // Set mode
            state.userMode = newMode;
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
