export const filepreview = {

    namespaced: true,

    state: {
        nodes: [],
        index: 0
    },

    mutations: {

        show(state, {nodes, index = 0}) {
            state.nodes = nodes;
            state.index = index < nodes.length && index > -1 ? index : 0;
        },

        clear(state) {
            state.nodes = [];
            state.index = 0;
        },

        next(state) {
            if (state.index + 1 < state.nodes.length) {
                state.index++;
            }
        },

        previous(state) {
            if (state.index - 1 > -1) {
                state.index--;
            }
        }
    }

};
