import config from '../../config/config';

function eventListener(method, elements, events, fn, options = {}) {

    // Normalize array
    if (elements instanceof HTMLCollection || elements instanceof NodeList) {
        elements = Array.from(elements);
    } else if (!Array.isArray(elements)) {
        elements = [elements];
    }

    if (!Array.isArray(events)) events = [events];

    for (const element of elements) {
        for (const event of events) {
            element[method](event, fn, {capture: false, ...options});
        }
    }

    return Array.prototype.slice.call(arguments, 1);
}

/**
 * Add event(s) to element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Remove event(s) from element(s).
 * @param elements DOM-Elements
 * @param events Event names
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

const unitify = (val, unit = 'px') => typeof val === 'number' ? val + unit : '' + val;

/**
 * Add css to a DOM-Element or returns the current
 * value of a property.
 *
 * @param el The Element.
 * @param attr The attribute or a object which holds css key-properties.
 * @param val The value for a single attribute.
 * @returns {*}
 */
export function css(el, attr, val) {
    const style = el && el.style;
    if (!style) return;

    if (typeof attr === 'object') {

        for (const prop in attr) {
            style[prop] = unitify(attr[prop]);
        }

    } else if (val == null) {

        const dw = document.defaultView;
        if (dw && dw.getComputedStyle) {
            val = dw.getComputedStyle(el, null);
        } else if (el.currentStyle) {
            val = el.currentStyle;
        }

        return attr == null ? val : val[attr];
    } else {
        style[attr] = unitify(val);
    }
}

export function simplifyEvent(evt) {
    const tap = (evt.touches && evt.touches[0] || evt);
    return {
        tap,
        x: tap.clientX,
        y: tap.clientY,
        target: tap.target
    };
}

/**
 * Detects keyboard-combinations
 * @param element Target element (where the event-listeners get binded).
 * @param cb A callback function which gets a object witch key-codes.
 * @param val A optional validator to detect keyboard-events.
 * @returns {Function}
 */
export function detectKeyCombinations(element, cb, val = () => true) {

    // Validate args
    if (!(element instanceof HTMLElement) && element !== window && element !== document) {
        throw 'Cannot detect keyboard combinations on a not-HTML Element.';
    }

    if (typeof cb !== 'function') {
        throw `Callback isn't a function.`;
    }

    if (typeof val !== 'function') {
        throw `Validator isn't a function.`;
    }

    // Keys hold the currently pressed key
    const keys = {};

    /**
     * Converts a string representation of a pressed character to a
     * prefix attached key.
     * 'e' => 'KeyE'
     * 'delete' => 'KeyDelete'
     */
    const toKeyCode = e => `Key${e.key[0].toUpperCase() + e.key.substr(1).toLowerCase()}`;

    // Listener to detect key-combinations
    const onKeyUp = e => delete keys[toKeyCode(e)];
    const onKeyDown = e => {

        // Check validator
        if (!val(e)) {
            return;
        }

        keys['ctrlKey'] = e.ctrlKey;
        keys['shiftKey'] = e.shiftKey;
        keys['altKey'] = e.altKey;
        keys['metaKey'] = e.metaKey;

        keys[toKeyCode(e)] = true;
        cb(keys, e);
    };

    // Bind listener
    element.addEventListener('keydown', onKeyDown);
    element.addEventListener('keyup', onKeyUp);

    // Return function to unbind listener
    return () => {
        element.removeEventListener('keydown', onKeyDown);
        element.removeEventListener('keyup', onKeyUp);
    };
}

/**
 * Polyfill for safari & firefox for the eventPath event property.
 * @param evt The event object.
 * @return [String] event path.
 */
export function eventPath(evt) {
    let path = evt.path || (evt.composedPath && evt.composedPath());
    if (path) {
        return path;
    }

    let el = evt.target.parentElement;
    path = [evt.target, el];
    while (el = el.parentElement) {
        path.push(el);
    }

    path.push(document, window);
    return path;
}

/**
 * Executes a regular expression on a string and
 * returns all matches as array.
 *
 * @param str
 * @param regex
 * @returns {Array}
 */
export function matchAll(str, regex) {
    const matches = [];
    let match;
    while (match = regex.exec(str)) {
        matches.push(match);
    }
    return matches;
}

/**
 * Converts something like '25.3MB' or '12.1KiB' to bytes.
 *
 * @param size
 * @returns {number}
 */
export function toBytes(size) {
    const type = size.replace(/[\d.i]+/g, '').toUpperCase();
    const amount = Number(size.replace(/\D+$/g, ''));
    const si = size.includes('i') ? 1024 : 1000;

    switch (type) {
        case'KB':
            return amount * si;
        case'MB':
            return amount * Math.pow(si, 2);
        case'GB':
            return amount * Math.pow(si, 3);
        case'TB':
            return amount * Math.pow(si, 4);
        case'PB':
            return amount * Math.pow(si, 5);
        default:
            return amount;
    }
}

/**
 * Convert a byte size to an human readable size.
 * e.g. 123456 => '123.46 kB'
 * @param bytes
 * @param mapValue Optional mapper to manipulate the raw number
 * @returns {string}
 */
export function readableByteCount(bytes, mapValue = v => v) {
    bytes = Number(bytes);

    const si = config.sizeSIPrefix;
    const unit = si ? 1000 : 1024;
    const block = bytes / unit;

    if (block < 1) {
        return `${bytes} B`;
    }

    for (let i = 1; i <= 6; i++) {
        if (block < Math.pow(unit, i)) {
            const size = (block / Math.pow(unit, i - 1)).toFixed(2);
            const desc = ' ' + (si ? 'kMGTPEB' : 'kMGTPEiB').charAt(i - 1) + (si ? '' : 'i') + 'B';
            return mapValue(size) + desc;
        }
    }

    return `${bytes} B`;
}

export const fileSystemUtils = {

    /**
     * See https://bugs.chromium.org/p/chromium/issues/detail?id=378883
     * Reads all entries from a DirectoryReader, just async
     * @param dirItemReader
     * @returns {Promise<*>} Null or an Array of entries
     */
    async readEntries(item) {
        const dirItemReader = item.createReader();
        return new Promise(async resolve => {
            const entries = [];

            for (; ;) {
                const newEntries = await new Promise(resolve1 => {
                    dirItemReader.readEntries(entries => resolve1(entries));
                });

                if (newEntries.length) {
                    entries.push(...newEntries);
                } else {
                    resolve(entries);
                    break;
                }
            }
        });
    },

    /**
     * See https://stackoverflow.com/a/20874931/7664765 and https://stackoverflow.com/a/8857445/7664765
     * Checks whenever a Files is a file
     *
     * @param file
     * @returns {Promise<*>} true or false
     */
    async isFile(file) {
        return new Promise(resolve => {

            // Perform some tests which seems correct
            if (file.size > 1048576) {
                resolve(true);
            } else {
                const reader = new FileReader();
                reader.onload = () => resolve(true);
                reader.onerror = () => resolve(false);
                reader.readAsArrayBuffer(file);
            }
        });
    }
};
