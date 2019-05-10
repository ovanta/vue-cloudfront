export const elements = {

    namespaced: true,

    state: {},

    mutations: {

        /**
         * Appends a new element to this module
         * @param state
         * @param key
         * @param element
         */
        set(state, {key, element}) {

            if (typeof key !== 'string' || !(element instanceof Element)) {
                throw 'Invalid element prop';
            }

            state[key] = element;
        }
    }
};
