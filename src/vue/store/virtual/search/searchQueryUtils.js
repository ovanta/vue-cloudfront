export default {

    // See inline-usage documentation
    parseQuery(query) {
        const filterRegex = /([\w]+):(.*?)( |$)/g;
        const filters = {};

        for (let match; (match = filterRegex.exec(query));) {

            // Skip invalid matches
            if (match.length < 3) {
                continue;
            }

            const type = match[1];

            // TODO: Firefox dont suppurt positiv lookbehind
            filters[type] = match[2].trim()
                .split(/(?<!\\),/g)
                .map(v => v.replace('\\,', ','));
        }

        return {
            filters,
            query: query.replace(filterRegex, '') // Return query without filters
        };
    },

    /**
     * Parses commands like '<1000', '>343.6' '232-4534' into
     * a Object with type 'smaller', 'bigger', 'between' and
     * correspondending value'a' or 'a' and 'b'.
     *
     * @param cmd String command
     * @param wrap Optional function which receives as parameter the parsed value, return
     *        value is used as prop value.
     * @returns {*}
     */
    parseLogicalInstruction(cmd, wrap = v => v) {

        // Validate
        if (typeof cmd === 'string' && cmd.length > 2) {

            /**
             * Parse lower as, bigger as and
             * between commands
             */
            if (cmd[0] === '<') {
                return {
                    type: 'smaller',
                    a: wrap(cmd.substr(1, cmd.length))
                };
            } else if (cmd[0] === '>') {
                return {
                    type: 'bigger',
                    a: wrap(cmd.substr(1, cmd.length))
                };
            } else if (cmd.includes('-')) {
                const sep = cmd.indexOf('-');
                return {
                    type: 'between',
                    a: wrap(cmd.substr(0, sep)),
                    b: wrap(cmd.substr(sep + 1, cmd.length))
                };
            }
        }

        return null;
    }
};
