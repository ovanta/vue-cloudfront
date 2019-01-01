import config    from '../../../../../config/config.json';
import {toBytes} from '../../../../js/utils';
import squ       from './searchQueryUtils';

export const search = {

    namespaced: true,

    state: {

        // If the user is currently searching for somenthing
        active: false,

        // Search result
        nodes: [],

        limit: config.searchBlockSize,

        /**
         * Search options, mutations are coming from
         * the buttons below the serach bar.
         */
        options: {
            type: 'all',
            ignoreCase: false,
            regex: false
        }
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
        },

        loadMore(state) {
            const {searchBlockSize} = config;

            if (state.limit + searchBlockSize >= state.nodes.length) {
                state.limit = state.nodes.length;
            } else {
                state.limit += searchBlockSize;
            }
        }
    },

    actions: {

        /**
         * Updates the current search
         * @param state
         * @param rootState
         * @param rawQuery
         */
        update({state, rootState}, rawQuery) {

            // If the query is empty, search should be disabled
            state.active = !!rawQuery;

            if (state.active) {

                // Reset limit to initial state
                state.limit = config.searchBlockSize;

                // Extract options
                const {type, regex, ignoreCase} = state.options;

                /**
                 * Parse query. Filters contains a associative array where
                 * the key is the filter prop and the value is an array.
                 * Supported filters are:
                 *     is: <FileExtension>
                 *
                 * Query is the search value without filter strings.
                 */
                let {filters, query} = squ.parseQuery(rawQuery);

                // Check if regexp and try to parse
                if (regex) {
                    try {
                        query = new RegExp(query, ignoreCase ? 'i' : '');
                    } catch (e) {
                        state.active = false;
                        return;
                    }
                } else if (ignoreCase) {

                    // Convert to lowercase if ignorecase is set
                    query = query.toLowerCase();
                }

                // Extract and prepare filters
                let {is, size, date} = filters;
                size = size && size.length && squ.parseLogicalInstruction(size[0], toBytes);
                date = date && date.length && squ.parseLogicalInstruction(date[0], v => new Date(v).getTime());

                state.nodes = [];
                const {nodes} = rootState;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {

                    // Check type
                    if (type !== 'all' && n.type !== type) {
                        continue;
                    }

                    // Check is filter
                    if (is && is.length && !is.includes(n.name.replace(/.*\./, ''))) {
                        continue;
                    }

                    // Check size filter
                    if (size) {
                        const {type, a, b} = size;
                        const nSize = n.size;

                        // Folders are not included in size filter
                        if (n.type === 'dir' ||
                            type === 'smaller' && nSize > a ||
                            type === 'bigger' && nSize < a ||
                            type === 'between' && !(nSize > a && nSize < b)) {
                            continue;
                        }
                    }

                    // Check date filter
                    if (date) {
                        const {type, a, b} = date;
                        const nLastModified = n.lastModified;

                        // Folders are not included in size filter
                        if (type === 'smaller' && nLastModified > a ||
                            type === 'bigger' && nLastModified < a ||
                            type === 'between' && !(nLastModified > a && nLastModified < b)) {
                            continue;
                        }
                    }

                    // Check for regex
                    if (regex) {

                        if (query.test(n.name)) {
                            state.nodes.push(n);
                        }

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
