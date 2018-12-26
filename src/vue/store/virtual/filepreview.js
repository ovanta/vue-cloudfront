export const filepreview = {

    namespaced: true,

    state: {
        nodes: []
    },

    mutations: {

        show(state, nodes) {
            state.nodes = nodes;
        },

        clear(state) {
            state.nodes = [];
        }

    }

};
