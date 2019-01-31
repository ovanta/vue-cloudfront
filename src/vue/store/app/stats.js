import websocket from '../../../websocket';

export const stats = {

    namespaced: true,

    state: {
        introBoxes: ['0', '1', '2']
    },

    mutations: {

        // Websocket sync
        socketSync(state, {payload}) {
            Object.assign(state, payload);
        }
    },

    actions: {

        /**
         * Synchronizes the current state with the server
         * @param state
         * @param rootState
         * @returns {Promise<T | never>}
         */
        async sync({state, rootState}) {
            return this.dispatch('fetch', {
                route: 'updateStats',
                body: {
                    apikey: rootState.auth.apikey,
                    stats: state
                }
            });
        },

        /**
         * Loads all events
         * @param state
         * @param rootState
         */
        async update({state, rootState}) {
            return this.dispatch('fetch', {
                route: 'getStats',
                body: {
                    apikey: rootState.auth.apikey
                }
            }).then(stats => Object.assign(state, stats));
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
            await this.dispatch('stats/update');

            // Call callback
            const newState = cb(JSON.parse(JSON.stringify(state)));

            // Push to server
            return this.dispatch('fetch', {
                route: 'updateStats',
                body: {
                    apikey: rootState.auth.apikey,
                    stats: newState
                }
            }).then(() => {

                // Sync with other instances
                websocket.broadcast('stats', 'change', newState);

                // Apply changes
                Object.assign(state, newState);
            });
        }
    }
};
