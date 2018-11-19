/**
 * Calls a function if vue instance is destroyed.
 */
export default {

    install(Vue) {
        const instances = {};

        Vue.mixin({

            // Call all functions if instance getting destroyed.
            destroyed() {
                const {_uid} = this;

                if (instances[_uid]) {

                    // Unsubscribe and delete
                    instances[_uid].forEach(fn => fn());
                    delete instances[_uid];
                }
            }
        });

        Vue.prototype.$callOnDestroy = function (...subs) {
            const {_uid} = this;

            /**
             * If instance does not contain a array for functions regarding to it,
             * create one.
             */
            if (!(_uid in instances)) {
                instances[_uid] = [];
            }

            // Append functions
            instances[_uid].push(...subs);
        };
    }
};
