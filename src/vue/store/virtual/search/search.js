import {toBytes, readableByteCount} from '../../../../js/utils';
import squ                          from './searchQueryUtils';

export const search = {

    namespaced: true,

    state: {

        // If the user is currently searching for somenthing
        active: false,
        rawQuery: '',
        query: '',

        // Search result
        nodes: [],

        /**
         * Search options, mutations are coming from
         * the buttons below the serach bar.
         */
        options: {
            type: 'all',
            ignoreCase: true,
            regex: false
        },

        // Current serach filters
        filter: []
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
         * @param rawQuery
         */
        update({state, rootState}, rawQuery) {

            // If the query is empty, search should be disabled
            state.active = !!rawQuery;
            state.query = '';
            state.filters = [];
            state.rawQuery = rawQuery || '';

            if (state.active) {

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
                state.query = query;

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

                state.filters.push(
                    ...(is || []),

                    ...(size ? [({
                        smaller: `Smaller than ${readableByteCount(size.a)}`,
                        bigger: `Bigger than ${readableByteCount(size.a)}`,
                        between: `Between ${readableByteCount(size.a)} and ${readableByteCount(size.b)}`
                    })[size.type]] : []),

                    ...(date ? [({
                        smaller: `Before ${new Date(date.a).toDateString()}`,
                        bigger: `After ${new Date(date.a).toDateString()}`,
                        between: `Between ${new Date(date.a).toDateString()} and ${new Date(date.b).toDateString()}`
                    })[date.type]] : [])
                );

                state.nodes = [];
                const {nodes} = rootState;
                for (let i = 0, a = nodes.length, n; n = nodes[i], i < a; i++) {

                    // Check type, if root or if in trash
                    if ((type !== 'all' && n.type !== type) || n.parent === 'root' || n._subBin) {
                        continue;
                    }

                    // Check is filter
                    if (is && is.length) {
                        const dotIndex = n.name.lastIndexOf('.');
                        const extension = ~dotIndex ? n.name.substring(dotIndex + 1) : null;

                        if (extension === n.name || !is.includes(extension) &&
                            !(is.includes('starred') && n.marked)) {
                            continue;
                        }
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
