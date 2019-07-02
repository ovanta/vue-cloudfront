/**
 * Wraps a bulk of strings into a nice, readable sentence
 * @param strings
 * @param maxCount
 * @returns {string}
 */
export default (strings, maxCount = 3) => {

    // Strange case, return nothing
    if (!strings.length) {
        return 'nothing';
    }

    // If theres only one node, return type and the name of it
    if (strings.length === 1) {
        return `${strings[0]} and ${strings[0]}`;
    }

    // Create a comma-seperated list of names
    const end = strings.length > maxCount ? maxCount : strings.length - 1;
    const nodesStr = strings.slice(0, end).join(', ');

    if (strings.length <= maxCount) {
        return `${nodesStr} and ${strings[end]}`;
    } 

        /**
         * If there is only one more node, just append it.
         * Otherwise append 'x others' because '1 others' sounds odd.
         */
        const rest = strings.length - maxCount;
        return `${nodesStr} and ${  rest === 1 ? strings[maxCount] : `${rest} others`}`;
    
}
