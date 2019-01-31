import config from '../config/config';
import store  from './vue/store/index';

const [, , websocketUrl] = config.apiEndPoint.match(/(https?:\/\/|^)(.*?)(\/|$)/);
const socket = new WebSocket(`ws://${websocketUrl}`);

let registered = false;
Object.assign(socket, {
    onmessage({data}) {

        try {
            data = JSON.parse(data);
        } catch (e) {

            /* eslint-disable no-console */
            console.warn(e);
        }

        const {type, value} = data;
        switch (type) {
            case 'registration-approval': {
                registered = true;

                /* eslint-disable no-console */
                console.log(`[WS] Websocket successful registered. Connections: ${value.connections}`);
                break;
            }
            case 'broadcast': {
                const {module, action, payload} = value;
                store.commit(`${module}/socketSync`, {action, payload});
                break;
            }
            default: {

                /* eslint-disable no-console */
                console.warn(`[WS] Unknown message type: ${type}`);
            }
        }
    }
});

function sendMessage(type, value) {
    socket.send(JSON.stringify({type, value}));
}

export default {
    register(apikey) {
        sendMessage('register', apikey);
    },

    broadcast(module, action, payload) {
        if (registered) {
            sendMessage('broadcast', {module, action, payload});
        } else {
            /* eslint-disable no-console */
            console.warn('Tried to broadcast message but websockt is currently not approved.');
        }
    }
};
