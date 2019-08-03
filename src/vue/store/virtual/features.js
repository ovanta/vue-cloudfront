export const features = {
    namespaced: true,

    state: {
        preferredColorScheme: {
            available: matchMedia('(prefers-color-scheme: dark)').media !== 'not all',
            value: null
        }
    },

    mutations: {

        update(state, {name, value}) {
            const prop = state[name];

            if (prop && prop.available) {
                prop.value = value;
            }
        }
    }
};
