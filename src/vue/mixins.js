import Vue from 'vue';

Vue.mixin({

    methods: {

        /**
         * Polyfill for safari & firefox for the eventPath event property.
         * @param evt The event object.
         * @return [String] event path.
         */
        eventPath(evt) {
            let path = evt.path || (evt.composedPath && evt.composedPath());
            if (path) return path;

            let el = evt.target.parentElement;
            path = [evt.target, el];
            while (el = el.parentElement) path.push(el);

            path.push(document, window);
            return path;
        },

        /**
         * Detects keyboard-combinations
         * @param element Target element (where the event-listeners get binded).
         * @param cb A callback function which gets a object witch key-codes.
         * @param val A optional validator to detect keyboard-events.
         * @returns {Function}
         */
        detectKeyCombinations(element, cb, val = () => true) {

            // Validate args
            if (!(element instanceof HTMLElement) && element !== window && element !== document) {
                throw 'Cannot detect keyboard combinations on a not-HTML Element.';
            }

            if (typeof cb !== 'function') {
                throw `Callback isn't a function.`;
            }

            if (typeof val !== 'function') {
                throw `Validator isn't a function.`;
            }

            // Keys hold the currently pressed key
            const keys = {};

            // Listener to detect key-combinations
            const onKeyUp = e => delete keys[e.code];
            const onKeyDown = e => {

                // Check validator
                if (!val(e)) {
                    return;
                }

                keys['ctrlKey'] = e.ctrlKey;
                keys['shiftKey '] = e.shiftKey;
                keys['altKey'] = e.altKey;
                keys['metaKey'] = e.metaKey;

                keys[e.code] = true;
                cb(keys, e);
            };

            // Bind listener
            element.addEventListener('keydown', onKeyDown);
            element.addEventListener('keyup', onKeyUp);

            // Return function to unbind listener
            return () => {
                element.removeEventListener('keydown', onKeyDown);
                element.removeEventListener('keyup', onKeyUp);
            };
        }
    }

});
