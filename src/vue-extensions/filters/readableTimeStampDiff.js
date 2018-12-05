import Vue from 'vue';

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
