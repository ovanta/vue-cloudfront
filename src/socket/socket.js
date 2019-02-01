import config            from '../../config/config';
import store             from '../vue/store/index';
import enhancedWebSocket from './enhancedWebSocket';

// Create socket client
const ws = enhancedWebSocket(`ws://${config.apiEndPoint.match(/(https?:\/\/|^)(.*?)(\/|$)/)[2]}`);

// If socket has been registered on the backend
let registered = false;
let apikey = null;

ws.on('connected', () => {

    // Try to re-register
    if (apikey && !registered) {
        ws.send(JSON.stringify({type: 'register', value: apikey}));
    }

    /* eslint-disable no-console */
    console.log(`[WS] Websocket successful connected.`);
});

ws.on('disconnected', () => {
    registered = false;

    /* eslint-disable no-console */
    console.log(`[WS] Websocket disconnected.`);
});

ws.on('message', ({data}) => {

    try {
        data = JSON.parse(data);
    } catch (e) {

        /* eslint-disable no-console */
        return console.warn(`[WS] Couldn't parse json: `, e);
    }

    const {type, value} = data;
    switch (type) {
        case 'registration-approval': {
            console.log(`[WS] Websocket successful registered.`);
            return registered = true;
        }
        case 'broadcast': {
            const {module, action, payload} = value;
            store.commit(`${module}/socketSync`, {action, payload});
        }
    }
});

// Export public functions
export default {
    register(akey) {
        apikey = akey;
        if (!registered) {
            ws.send(JSON.stringify({type: 'register', value: apikey}));
        }
    },

    broadcast(module, action, payload) {
        if (registered) {
            ws.send(JSON.stringify({type: 'broadcast', value: {module, action, payload}}));
        } else {

            /* eslint-disable no-console */
            console.warn('Tried to broadcast message but websockt is currently not approved.');
        }
    }
};
