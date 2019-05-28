/**
 * Pick specific props from an object
 * @param object
 * @param props
 */
export default (object, ...props) => {
    const newObj = {};

    for (let i = 0, l = props.length; i < l; i++) {
        const prop = props[i];
        newObj[prop] = object[prop];
    }

    return newObj;
}
