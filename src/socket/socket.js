import {websocketEndPoint} from '../../config/config';
import store               from '../vue/store/index';
import enhancedWebSocket   from './enhancedWebSocket';

// Create socket client
const ws = enhancedWebSocket(websocketEndPoint.startsWith('/') ? `wss://${location.host + websocketEndPoint}` : websocketEndPoint);

// If socket has been registered on the backend
let registered = false;
let apikey = null;

/* eslint-disable no-console */
ws.on('connected', () => {

    // Try to re-register
    if (apikey && !registered) {
        ws.send(JSON.stringify({type: 'register', value: apikey}));
    }

    console.log(`[WS] Websocket connected.`);
});

/* eslint-disable no-console */
ws.on('disconnected', () => {
    registered = false;
    console.log(`[WS] Websocket disconnected.`);
});

/* eslint-disable no-console */
ws.on('message', ({data}) => {

    try {
        data = JSON.parse(data);
    } catch (e) {
        return console.warn(`[WS] Couldn't parse json: `, e);
    }

    const {type, value} = data;
    switch (type) {
        case 'registration-approval': {
            console.log(`[WS] Websocket successful registered.`);

            // Check if the last change is past the current state, update if so
            if (store.state.auth.lastAuthentication < value.lastBroadcast) {
                store.dispatch('nodes/update', {keepLocation: true}).catch(console.warn);
            }

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
