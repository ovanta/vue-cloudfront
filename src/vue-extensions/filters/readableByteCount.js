import config from '../../../config/config.json';
import Vue    from 'vue';

/**
 * Convert a byte size to an human readable size.
 * e.g. 123456 => '123.46 kB'
 */
Vue.filter('readableByteCount', bytes => {
    bytes = Number(bytes);

    if (!bytes) {
        return 'Empty';
    }

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
            return size + desc;
        }
    }

    return `${bytes} B`;
});
