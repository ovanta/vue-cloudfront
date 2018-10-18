export const location = {

    namespaced: true,

    /**
     * Example location matching the current nodes list,
     * will be replaced with random generated data.
     */
    state: [],

    getters: {
        currentLocation(state) {
            return state[state.length - 1];
        }
    },

    mutations: {

        /**
         * Updates the current position, if the hash already exists and the user is at least
         * one element under the root itself and all elements after it gets removed whereby
         * the last element is the node above the hash. Otherwiese it will be put on the top of the current location.
         * @param state
         * @param hash
         */
        update(state, hash) {

            // Validate
            if (typeof hash !== 'string') {
                throw 'Cannot perform UPDATE in location. hash is not a string';
            }

            const idx = state.indexOf(hash);
            if (~idx) {
                state.splice(state.indexOf(hash) + 1, state.length);
            } else {
                state.push(hash);
            }

        },

        /**
         * Goes one up in the hierarchy
         * @param state
         */
        goUp(state) {

            if (state.length < 2) {
                throw 'Cannot perform GOUP in location. There is no level upwards';
            }

            state.splice(state.length - 1, 1);
        }

    }
};
