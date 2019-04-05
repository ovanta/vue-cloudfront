import websocket from '../../../socket/socket';

export const errors = {

    namespaced: true,

    state: {
        listening: false,
        logs: []
    },

    mutations: {

        socketSync(state, {action, payload}) {
            switch (action) {
                case 'put': {
                    state.logs.push(payload);
                }
            }
        },

        /* eslint-disable no-console */
        listen(state) {

            if (state.listening) {
                console.warn('Vuex error module already listening');
            }

            state.listening = true;
            ['warn', 'error'].forEach(override);

            function handle(type, data) {
                const obj = {type, data};

                // Broadcast
                websocket.broadcast('errors', 'put', obj);

                // Update state
                state.logs.push(obj);
            }

            function override(fn) {
                const original = console[fn];

                console[fn] = (...data) => {
                    handle(fn, data);
                    original(...data);
                };
            }

            window.onerror = (msg, url, line) => handle('error', {msg, url, line});
        }
    }
};
