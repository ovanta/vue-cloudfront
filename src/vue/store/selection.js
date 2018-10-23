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

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform APPEND in selection. nodes isn't an Array.`;
            }

            nodes.forEach(v => !state.includes(v) && state.push(v));
        },

        remove(state, nodes) {

            // Validate
            if (!Array.isArray(nodes)) {
                throw `Cannot perform REMOVE in selection. nodes isn't an Array`;
            }

            for (let i = 0; i < nodes.length; i++) {

                // Check if node exists and remove it
                const index = state.indexOf(nodes[i]);
                if (~index) {
                    state.splice(index, 1);
                }
            }
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
