import store from './vue/store/index';

const socket = new WebSocket('ws://79.214.141.96:8080');

function sendMessage(type, value) {
    socket.send(JSON.stringify({type, value}));
}

socket.onmessage = msg => {
    try {
        const {action, payload} = JSON.parse(msg.data);
        store.commit('nodes/sync', {action, payload});
    } catch (e) {

        /* eslint-disable no-console */
        console.warn(e);
    }
};

export default {
    register(apikey) {
        sendMessage('register', apikey);
    },
    broadcast(action, payload) {
        sendMessage('broadcast', {action, payload});
    }
};
