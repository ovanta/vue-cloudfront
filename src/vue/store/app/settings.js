import websocket from '../../../socket/socket';

export const settings = {

    namespaced: true,

    state: {

        // Cannot be changed by the user
        static: {
            introBoxes: ['0', '1', '2']
        },

        user: {
            siPrefix: true,
            hideTooltips: false,
            immediateDeletion: false,
            usePreferredColorScheme: false,
            defaultFolderColor: '#333',
            theme: null
        }
    },

    mutations: {

        // Websocket sync
        socketSync(state, {payload}) {
            Object.assign(state, payload);
        }
    },

    actions: {

        /**
         * Loads all events
         * @param state
         * @param rootState
         */
        async update({state, rootState}) {
            return this.dispatch('fetch', {
                route: 'settings',
                silent: true,
                body: {
                    apikey: rootState.auth.apikey
                }
            }).then(settings => Object.assign(state, settings));
        },

        /**
         * Allows the possibility to change the stats (and sync these
         * with the server)
         *
         * @param state
         * @param rootState
         * @param cb Callback, receives a deep-copy of the current state as first and only argument
         * @returns {Promise<T | never>}
         */
        async change({state, rootState}, cb) {

            // Sync with server
            await this.dispatch('settings/update');

            // Call callback
            const newState = cb(JSON.parse(JSON.stringify(state)));

            // Push to server
            return this.dispatch('fetch', {
                route: 'updateSettings',
                silent: true,
                body: {
                    apikey: rootState.auth.apikey,
                    settings: newState
                }
            }).then(() => {

                // Sync with other instances
                websocket.broadcast('settings', 'change', newState);

                // Apply changes
                Object.assign(state, newState);
            });
        }
    }
};
