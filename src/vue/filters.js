import Vue from 'vue';

/**
 * Convert a byte size to an human readable size.
 */
Vue.filter('readableByteCount', bytes => {
    bytes = Number(bytes);

    if (!bytes) {
        return 'Empty';
    }

    const si = true;
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


/**
 * Convert a timestamp to a fancy date string.
 */
Vue.filter('readableTimestamp', timestamp => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.toLocaleDateString('us-en', {month: 'short'});
    const year = date.getFullYear();

    return `${day} ${month}. ${year}`;
});
