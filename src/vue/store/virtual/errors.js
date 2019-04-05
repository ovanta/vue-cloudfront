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

            // Disable during development
            if (process.env.NODE_ENV === 'production') {

                // Prevent multiple initialization
                if (state.listening) {
                    console.warn('Vuex error module already listening');
                }

                const handle = (type, data) => {
                    const obj = {type, data};

                    // Broadcast
                    websocket.broadcast('errors', 'put', obj);

                    // Update state
                    state.logs.push(obj);
                };

                const override = fn => {
                    const original = console[fn];
                    console[fn] = (...data) => {
                        handle(fn, data);
                        original(...data);
                    };
                };

                state.listening = true;
                ['warn', 'error'].forEach(override);
                window.onerror = (msg, url, line) => handle('error', {msg, url, line});
            }
        }
    }
};
