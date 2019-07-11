/**
 * Add css to a DOM-Element or returns the current
 * value of a property.
 *
 * @param el The Element.
 * @param attr The attribute or a object which holds css key-properties.
 * @param val The value for a single attribute.
 * @returns {*}
 */
export default (el, attr, val) => {
    const unitify = (val, unit = 'px') => typeof val === 'number' ? val + unit : `${val}`;
    const style = el && el.style;
    if (!style) return;

    if (typeof attr === 'object') {

        for (const [prop, val] of Object.entries(attr)) {
            style[prop] = unitify(val);
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
