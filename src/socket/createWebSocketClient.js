export default (url) => {
    const events = {};
    const ws = new WebSocket(url);

    // TODO: Create self-healing websocket
    ws.addEventListener('message', ({data}) => {

        try {
            data = JSON.parse(data);
        } catch (e) {

            /* eslint-disable no-console */
            console.warn(`[WS] Couldn't parse json: `, e);
        }

        const {type, value} = data;
        const fn = events[type];
        if (typeof fn === 'function') {
            fn(value);
        }
    });

    return {

        on(type, handler) {
            events[type] = handler;
            return this;
        },

        addEventListener(...args) {
            ws.addEventListener(...args);
        },

        removeEventListener(...args) {
            ws.removeEventListener(...args);

        },

        sendMessage(type, value) {
            // TODO: Race condition if socket is not open yet?

            // Validate
            if (typeof type !== 'string') {
                console.error('[WS] Invalid type: ', typeof type);
            }

            ws.send(JSON.stringify({type, value}));
        }
    };
}
