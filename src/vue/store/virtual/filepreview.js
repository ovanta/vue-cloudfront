export const filepreview = {

    namespaced: true,

    state: {
        nodes: null
    },

    mutations: {

        show(state, nodes) {
            state.nodes = nodes;
        },

        clear(state) {
            state.nodes = null;
        }

    }

};
