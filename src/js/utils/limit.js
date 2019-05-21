/**
 * Wraps boundaries around a value and prevents overflowing these.
 * @param value
 * @param min
 * @param max
 * @returns {*}
 */
export default (value, min, max) => {
    if (value < min) {
        return min;
    } else if (value > max) {
        return max;
    }

    return value;
}
