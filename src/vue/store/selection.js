export const selection = {

    namespaced: true,

    state: [],

    mutations: {

        /**
         * Appends nodes to the selection
         * @param state
         * @param nodes
         */
        append(state, nodes) {

            if (!nodes) {
                throw 'Cannot append [no] nodes';
            }

            nodes.forEach(v => !state.includes(v) && state.push(v));
        },

        /**
         * Clears the selection
         * @param state
         */
        clear(state) {
            state.splice(0, state.length);
        }

    }

};
