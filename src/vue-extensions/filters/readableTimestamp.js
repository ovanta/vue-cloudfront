import Vue from 'vue';

/**
 * Convert a timestamp to a better readable date-time string.
 * e.g. 1544469018383 => '20:10 - 10 Dec. 2018'
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
