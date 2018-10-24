export const search = {

    namespaced: true,

    state: {
        active: false,
        options: {
            type: 'all',
            regex: false
        },
        nodes: []
    },

    mutations: {

        /**
         * Sets a option property
         * @param state
         * @param key
         * @param value
         */
        setOption(state, {key, value}) {
            state.options[key] = value;
        }

    },

    actions: {

        /**
         * Updates the current search
         * @param state
         * @param rootState
         * @param query
         */
        update({state, rootState}, query) {

            // If the query is empty, search should be disabled
            state.active = !!query;

            if (state.active) {

                // Extract options properties for further usage
                const {type, regex, ignoreCase} = state.options;

                // Check if regexp and try to parse
                if (regex) {
                    try {
                        query = new RegExp(query, ignoreCase ? 'i' : '');
                    } catch (e) {
                        console.log(`[SRH] Invalid regexp skipped: '${query}'`);
                        state.active = false;
                        return;
                    }
                }

                // Convert to lowercase if ignorecase is set
                if (ignoreCase) {
                    query = query.toLowerCase();
                }

                state.nodes = [];
                const nodes = rootState.nodes;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {

                    // Check type
                    if (type !== 'all' && n.type !== type) {
                        continue;
                    }

                    // Check for regex
                    if (regex && query.test(n.name)) {
                        state.nodes.push(n);
                    } else if (ignoreCase && n.name.toLowerCase().includes(query)) {
                        state.nodes.push(n);
                    } else if (n.name.includes(query)) {
                        state.nodes.push(n);
                    }
                }
            }
        }
    }

};
