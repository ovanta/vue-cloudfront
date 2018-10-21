export const search = {

    namespaced: true,

    state: {
        active: false,
        nodes: []
    },

    actions: {

        update({state, rootState}, opt) {
            state.active = !!opt.query;

            if (state.active) {

                // Check if regexp and try to parse
                let query = opt.query;
                if (opt.regex) {
                    try {
                        query = new RegExp(query);
                    } catch (e) {
                        console.log(`[SRH] Invalid regexp skipped: '${query}'`);
                        state.active = false;
                        return;
                    }
                }

                state.nodes = [];
                const nodes = rootState.nodes;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {

                    // Find nodes where the name matches the query
                    if (opt.regex ? query.test(n.name) : n.name.includes(query)) {
                        state.nodes.push(n);
                    }
                }
            }
        }

    }

};
