export default url => {
    const eventListener = [];
    let websocket;
    let discTimeout, pingTimeout;

    !function start() {
        const restart = () => {

            // Dispatch custom event
            websocket.dispatchEvent(new Event('disconnected'));

            // Clear pinging and disconnected timeouts and intervals
            clearInterval(pingTimeout);
            clearTimeout(discTimeout);

            // Check every second if ethernet is available
            const checkInterval = setInterval(() => {
                if (navigator.onLine) {
                    clearInterval(checkInterval);
                    start();
                }
            }, 1000);
        };

        websocket = new WebSocket(url);
        websocket.addEventListener('open', () => {

            // Add event listener
            for (const args of eventListener) {
                websocket.addEventListener(...args);
            }

            // Ping every 5s
            pingTimeout = setInterval(() => {
                websocket.send('__ping__');
                discTimeout = setTimeout(websocket.close, 2500);
            }, 5000);

            websocket.dispatchEvent(new Event('connected'));
        });

        websocket.addEventListener('message', e => {

            // Check if message is the answer of __ping__ stop propagation if so
            if (e.data === '__pong__') {
                clearTimeout(discTimeout);
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        });

        websocket.addEventListener('close', restart);
    }();

    return {
        on(...args) {

            // If websocket is open and present, directly attach it
            if (websocket && websocket.readyState === websocket.OPEN) {
                websocket.addEventListener(...args);
            }

            eventListener.push(args);
            return args;
        },

        off(...args) {

            // If websocket is open and present, directly remove it
            if (websocket && websocket.readyState === websocket.OPEN) {
                websocket.removeEventListener(...args);
            }

            const index = eventListener.indexOf(args);
            if (~index) {
                eventListener.splice(index, 1);
            }
        },

        send(...args) {
            if (websocket) {
                websocket.send(...args);
            }
        }
    };
}
