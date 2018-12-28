export const share = {

    namespaced: true,

    state: {
        node: null
    },

    mutations: {

        set(state, node) {
            state.node = node;
        }

    }

};
