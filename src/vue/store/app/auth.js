export const auth = {

    namespaced: true,

    state: {

        /**
         * Session-key which can an and should be used to fetch data or perform actions.<
         * Is used in the nodes store module.
         */
        apikey: null
    },

    mutations: {

        /**
         * Updates the current authentication state
         *
         * @param state
         * @param apikey New apikey
         * @param userMode Usermode, is used to change UI components and behaviour.
         * @returns {Promise<void>}
         */
        update(state, {apikey}) {
            state.apikey = apikey;
        },

        logout(state) {

            // Reset apikey
            state.apikey = null;
            localStorage.removeItem('apikey');
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
            return this.dispatch('fetch', {
                route: type,
                body: credentials
            }).then(({error, data}) => {

                if (error) {
                    throw error;
                }

                // Save apikey to localstorage and update module
                localStorage.setItem('apikey', data.apikey);
                this.commit('auth/update', {apikey: data.apikey});

                // Update nodes
                return this.dispatch('nodes/update');
            });
        },

        /**
         * Checks an existing apikey
         * @param apikey
         */
        async key(_, {apikey}) {
            return this.dispatch('fetch', {
                route: 'checkApiKey',
                body: {apikey}
            }).then(({error}) => {

                if (!error) {
                    this.commit('auth/update', {apikey});

                    // Update nodes
                    return this.dispatch('nodes/update');
                } else {
                    this.commit('auth/logout');
                }
            });
        }
    }
};
