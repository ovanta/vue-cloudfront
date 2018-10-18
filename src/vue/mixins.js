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
        }
    }

});
