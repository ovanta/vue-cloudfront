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
        setSessionKey(state, newKey) {

            // Validate
            if (!(typeof newKey !== 'string')) {
                throw `Cannot perform 'setSessionKey' in mutations. newKey isn't a String.`;
            }

            // Set key
            state.sessionKey = newKey;
        },

        setUserMode(state, newMode) {

            // Validate
            if (!['normal', 'demo'].includes(newMode)) {
                throw `Cannot perform 'setSessionKey' in mutations. newMode can only be 'normal' or 'demo'`;
            }

            // Set mode
            state.userMode = newMode;
        }

    }
};
