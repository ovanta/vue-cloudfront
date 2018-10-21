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
                let {query, options} = opt;
                if (options.regex) {
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
                const {type, regex} = options;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {

                    // Check type
                    if (type !== 'all' && n.type !== type) {
                        continue;
                    }

                    // Check if regex, apply or use simple includes
                    if (regex ? query.test(n.name) : n.name.includes(query)) {
                        state.nodes.push(n);
                    }
                }
            }
        }

    }

};
