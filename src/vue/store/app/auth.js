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
        }
    },

    actions: {

        async logout() {
            localStorage.removeItem('apikey');
            location.reload(true);
        },

        /**
         * Authenticates a user
         * @param credentials username, password and so on.
         */
        async login(_, credentials) {
            return this.dispatch('fetch', {
                route: 'login',
                body: credentials
            }).then(({apikey}) => {

                // Save apikey to localstorage and update module
                localStorage.setItem('apikey', apikey);
                this.commit('auth/update', {apikey});

                // Jump to home tab
                this.commit('setActiveTab', 'home');

                // Update nodes
                return this.dispatch('nodes/update');
            });
        },

        /**
         * Authenticates a user
         * @param credentials username, password and so on.
         */
        async register(_, credentials) {
            return this.dispatch('fetch', {
                route: 'register',
                body: credentials
            }).then(({apikey}) => {

                // Save apikey to localstorage and update module
                localStorage.setItem('apikey', apikey);
                this.commit('auth/update', {apikey});

                // Jump to home tab
                this.commit('setActiveTab', 'home');

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
            }).then(() => {

                this.commit('auth/update', {apikey});

                // Update nodes
                return this.dispatch('nodes/update');
            }).catch(() => {
                this.dispatch('auth/logout');
            });
        }
    }
};
