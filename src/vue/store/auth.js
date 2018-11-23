export const auth = {

    namespaced: true,

    /**
     * Session-key which can an and should be used to fetch data or perform actions.
     * Is used in the nodes store module.
     */
    state: {
        sessionKey: null
    },

    mutations: {

        // Sets a new session key
        setSessionKey(store, newKey) {

            // Validate
            if (!(typeof newKey !== 'string')) {
                throw `Cannot perform 'setSessionKey' in mutations. newKey isn't a String.`;
            }

            // Set key
            store.sessionKey = newKey;
        }

    }
};
