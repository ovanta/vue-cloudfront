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

                state.nodes = [];
                const nodes = rootState.nodes;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {

                    // Find nodes where the name matches the query
                    if (n.name.includes(query)) {
                        state.nodes.push(n);
                    }
                }
            }
        }

    }

};
