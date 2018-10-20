export const search = {

    namespaced: true,

    state: {
        active: false,
        nodes: []
    },

    actions: {

        update({state, rootState}, query) {
            state.active = !!query;

            if (state.active) {
                state.nodes = rootState.nodes.filter(n => n.name.includes(query));
            }
        }

    }

};
