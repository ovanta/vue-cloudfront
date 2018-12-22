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
        update(state, {apikey = -1}) {
            state.apikey = apikey;
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

            return this.dispatch('fetch', {
                route: type,
                body: credentials
            }).then(({error, data}) => {

                if (error) {
                    throw error;
                }

                this.commit('auth/update', {apikey: data.apikey});
            });
        }
    }
};
