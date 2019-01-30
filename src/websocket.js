import store from './vue/store/index';

const socket = new WebSocket('ws://79.214.141.96:8080');

function sendMessage(type, value) {
    socket.send(JSON.stringify({type, value}));
}

let registered = false;
socket.onmessage = ({data}) => {
    if (data === 'registration-approval') {
        registered = true;
    } else {
        try {
            const {module, action, payload} = JSON.parse(data);
            store.commit(`${module}/socketSync`, {action, payload});
        } catch (e) {

            /* eslint-disable no-console */
            console.warn(e);
        }
    }
};

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
