import config             from '../../config/config';
import store              from '../vue/store/index';
import createSocketClient from './createWebSocketClient';

// Create socket client
const socket = createSocketClient(`ws://${config.apiEndPoint.match(/(https?:\/\/|^)(.*?)(\/|$)/)[2]}`);

// If socket has been registered on the backend
let registered = false;

/* eslint-disable no-console */
socket.on('registration-approval', () => {
    registered = true;
    console.log(`[WS] Websocket successful registered.`);
});

socket.on('broadcast', ({module, action, payload}) => {
    store.commit(`${module}/socketSync`, {action, payload});
});

// Export public functions
export default {
    register(apikey) {
        if (!registered) {
            socket.sendMessage('register', apikey);
        }
    },

    broadcast(module, action, payload) {
        if (registered) {
            socket.sendMessage('broadcast', {module, action, payload});
        } else {

            /* eslint-disable no-console */
            console.warn('Tried to broadcast message but websockt is currently not approved.');
        }
    }
};
