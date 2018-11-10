/**
 * Calls a function if vue instance is destroyed.
 */
export default {

    install(Vue) {
        const instances = {};

        Vue.mixin({

            // Call all functions if instance getting destroyed.
            destroyed() {

                if (instances[this]) {

                    // Unsubscribe and delete
                    instances[this].forEach(fn => fn());
                    delete instances[this];
                }
            }
        });

        Vue.prototype.$callOnDestroy = function (...subs) {

            /**
             * If instance does not contain a array for functions regarding to it,
             * create one.
             */
            if (!(this in instances)) {
                instances[this] = [];
            }

            // Append functions
            instances[this].push(...subs);
        };
    }
};
