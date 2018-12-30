import {readableByteCount} from '../../js/utils';
import Vue                 from 'vue';

/**
 * Convert a byte size to an human readable size.
 * e.g. 123456 => '123.46 kB'
 *
 * Returns 'Empty' if bytes is zero
 */
Vue.filter('readableByteCount', bytes => {
    const res = readableByteCount(bytes);
    return res ? res : 'Empty';
});
