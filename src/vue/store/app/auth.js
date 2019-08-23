import websocket from '../../../socket/socket';

export const auth = {

    namespaced: true,

    state: {

        /**
         * Session-key which can an and should be used to fetch data or perform actions.<
         * Is used in the nodes store module.
         */
        apikey: null,

        // Timestamp of last authentication
        lastAuthentication: null,

        // Server and user informations
        status: null,

        // Currently active sessions
        activeSessions: []
    },

    mutations: {

        /**
         * Replaces, adds or removes a session
         * @param state
         * @param action
         * @param value
         * @returns {*}
         */
        updateActiveSessions(state, [action, value]) {
            switch (action) {
                case 'replace':
                    return state.activeSessions.splice(0, state.activeSessions.length, ...value);
                case 'add':
                    return state.activeSessions.push(value);
                case 'remove': {
                    const {id} = value;
                    return state.activeSessions = state.activeSessions.filter(s => s.id !== id);
                }
            }
        },

        socketSync(_, {action}) {
            switch (action) {
                case 'logout': {
                    this.commit('auth/localLogout');
                }
            }
        },

        localLogout() {
            localStorage.removeItem('apikey');
            localStorage.removeItem('theme');
            location.reload();
        }
    },

    actions: {

        /**
         * @param apikey
         * @returns {Promise<T | never>}
         */
        async logout({state: {apikey}}) {
            await this.dispatch('fetch', {
                silent: true,
                route: 'logout',
                body: {apikey}
            });

            this.commit('auth/localLogout');
        },

        /**
         * @param apikey
         * @returns {Promise<*>}
         */
        async logoutEverywhere({state: {apikey}}) {
            return new Promise((resolve, reject) => {

                // Warn user
                this.commit('dialogbox/show', {
                    type: 'info',
                    title: 'Are you sure?',
                    text: 'This will close all active sessions, everywhere.',
                    buttons: [
                        {type: 'cancel', text: 'Cancel'},
                        {type: 'accept', text: 'Okay'}
                    ],
                    onResolve: index => {
                        if (index) {

                            // Logout live-sessions
                            websocket.broadcast('auth', 'logout');

                            // Remove all apikeys
                            this.dispatch('fetch', {
                                route: 'logoutEverywhere',
                                body: {apikey}
                            }).then(() => {
                                this.commit('auth/localLogout');
                                resolve();
                            }).catch(reject);
                        }
                    }
                });
            });
        },

        /**
         * Authenticates a user
         * @param state
         * @param credentials username, password and so on.
         */
        async login({state}, credentials) {
            return this.dispatch('fetch', {
                route: 'login',
                body: credentials
            }).then(({apikey}) => {

                // Save apikey to localstorage and update module
                localStorage.setItem('apikey', apikey);
                state.apikey = apikey;
                state.lastAuthentication = Date.now();

                // Register websocket
                websocket.register(apikey);

                // Jump to dashboard
                this.commit('setActiveTab', 'dashboard');

                // Update nodes and perform first-time sync of stats
                return Promise.all([
                    this.dispatch('settings/update'),
                    this.dispatch('nodes/update'),
                    this.dispatch('auth/status')
                ]);
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
            }).then(({apikey}) => this.dispatch('auth/key', {apikey}));
        },

        /**
         * Checks an existing apikey
         * @param state
         * @param apikey
         */
        async key({state}, {apikey}) {
            return this.dispatch('fetch', {
                route: 'checkApiKey',
                body: {apikey}
            }).then(() => {
                state.apikey = apikey;
                state.lastAuthentication = Date.now();

                // Register websocket
                websocket.register(apikey);

                // Update everything
                return Promise.all([
                    this.dispatch('settings/update'),
                    this.dispatch('nodes/update'),
                    this.dispatch('auth/status')
                ]);
            }).catch(() => {
                this.dispatch('auth/logout');
            });
        },

        /**
         * Responsible for changing the password or username, if this promise
         * gets rejected String is used as error message.
         *
         * @param state
         * @param currentPassword Current password
         * @param newUsername New username (optional)
         * @param newPassword New passoword (optional)
         * @returns {Promise<void>}
         */
        async updateCredentials({state}, {currentPassword, newUsername, newPassword}) {
            return this.dispatch('fetch', {
                route: 'updateCredentials',
                body: {
                    apikey: state.apikey,
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
         * @param password - Current password
         * @returns {Promise<void>}
         */
        async deleteAccount({state}, {password}) {

            // Request user confirmation
            this.commit('dialogbox/show', {
                title: 'Delete account',
                text: 'With this all perma-links, files and folders will be removed. Are you sure? This action cannot be undone, neither your data restored.',
                buttons: [
                    {type: 'cancel', text: 'Cancel'},
                    {type: 'accept', text: 'Okay'}
                ],
                onResolve: index => {
                    if (index) {
                        this.dispatch('fetch', {
                            route: 'deleteAccount',
                            body: {
                                apikey: state.apikey,
                                password
                            }
                        }).then(() => {

                            // Logout
                            this.dispatch('auth/logout');
                        });
                    }
                }
            });
        },

        /**
         * Requests basic session and server informations
         * @param state
         * @returns {Promise<*|Promise<any>>}
         */
        async status({state}) {
            return this.dispatch('fetch', {
                route: 'status',
                body: {apikey: state.apikey}
            }).then(res => {
                state.status = res;
                return res;
            });
        }
    }
};
