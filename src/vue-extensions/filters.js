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
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const day = date.getDate();
    const month = date.toLocaleDateString('us-en', {month: 'short'});
    const year = date.getFullYear();

    return `${hour}:${minute} - ${day} ${month}. ${year}`;
});

/**
 * Returns a readable distance of a timestamp to now.
 * e.g. '10 seconds ago'
 */
Vue.filter('readableTimeStampDiff', diff => {
    if (diff < 30000) {
        return 'just now';
    } else if (diff < 60000) {
        const v = Math.floor(diff / 1000);
        return `${v} second${v > 1 ? 's' : ''} ago`;
    } else if (diff < 3600000) {
        const v = Math.floor(diff / 60000);
        return `${v} minute${v > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) {
        const v = Math.floor(diff / 3600000);
        return `${v} hour${v > 1 ? 's' : ''} ago`;
    } else if (diff < 2592000000) {
        const v = Math.floor(diff / 86400000);
        return `${v} day${v > 1 ? 's' : ''} ago`;
    }
});
