/**
 * Executes a regular expression on a string and
 * returns all matches as array.
 *
 * @param str
 * @param regex
 * @returns {Array}
 */
export default (str, regex) => {
    const matches = [];

    for (let match; (match = regex.exec(str));) {
        matches.push(match);
    }

    return matches;
}
