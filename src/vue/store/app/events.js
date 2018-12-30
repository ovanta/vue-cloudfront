export const events = {

    namespaced: true,

    state: {
        introBoxes: ['0', '1', '2']
    },

    actions: {

        /**
         * Loads all events
         * @param state
         * @param rootState
         */
        async update({state, rootState}) {
            return this.dispatch('fetch', {
                route: 'getEvents',
                body: {
                    apikey: rootState.auth.apikey,
                    event: 'all'
                }
            }).then(events => {
                for (const [key, value] of Object.entries(events)) {
                    state[key] = value;
                }
            });
        },

        /**
         * Synchronizes the state with the server
         * @param state
         * @param rootState
         * @returns {Promise<T | never>}
         */
        async sync({state, rootState}) {
            return this.dispatch('fetch', {
                route: 'updateEvents',
                body: {
                    apikey: rootState.auth.apikey,
                    events: state
                }
            });
        },

        async removeIntroBox({state}, {id}) {
            const idx = state.introBoxes.indexOf(id);
            ~idx && state.introBoxes.splice(idx, 1);
            return this.dispatch('events/sync');
        },

        async removeAllIntroBoxes({state}) {
            state.introBoxes = [];
            return this.dispatch('events/sync');
        }
    }
};
