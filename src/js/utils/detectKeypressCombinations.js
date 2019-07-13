/**
 * Detects keyboard-combinations
 * @param el Target element (where the event-listeners get binded).
 * @param cb A callback function which gets a object witch key-codes.
 * @param val A optional validator to detect keyboard-events.
 * @returns {Function}
 */
export default (el, cb, val = () => true) => {

    // Validate args
    if (!(el instanceof HTMLElement) && el !== window && el !== document) {
        throw 'Cannot detect keyboard combinations on a not-HTML Element.';
    }

    if (typeof cb !== 'function') {
        throw `Callback isn't a function.`;
    }

    if (typeof val !== 'function') {
        throw `Validator isn't a function.`;
    }

    // Keys hold the currently pressed key
    const keys = new Map();
    const transformKey = ({key}) => key.length === 1 ? key.toLowerCase() : key;

    // Listener to detect key-combinations
    const onKeyUp = e => keys.set(transformKey(e), false);
    const onKeyDown = e => {

        // Check validator
        if (!val(e)) {
            return;
        }

        keys.set(transformKey(e), true);
        cb(keys, e);
    };

    // Bind listener
    el.addEventListener('keydown', onKeyDown);
    el.addEventListener('keyup', onKeyUp);

    // Return function to unbind listener
    return () => {
        el.removeEventListener('keydown', onKeyDown);
        el.removeEventListener('keyup', onKeyUp);
    };
}
