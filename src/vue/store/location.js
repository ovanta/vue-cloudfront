export const location = {

    namespaced: true,

    /**
     * Example location matching the current nodes list,
     * will be replaced with random generated data.
     */
    state: ['7db715e9f7a', '48e7ff6313b'],

    mutations: {

        /**
         * Updates the current position, if the hash already exists and the user is at least
         * one element under the root itself and all elements after it gets removed whereby
         * the last element is the node above the hash. Otherwiese it will be put on the top of the current location.
         * @param state
         * @param hash
         */
        update(state, hash) {

            const idx = state.indexOf(hash);
            if (~idx) {
                idx && state.splice(state.indexOf(hash), state.length);
            } else {
                state.push(hash);
            }

        }

    }

};
