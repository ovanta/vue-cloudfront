export const connection = {
    namespaced: true,

    state: {
        ethernet: window.navigator.onLine,
        socketRegistered: false
    },

    mutations: {

        set(state, {key, val}) {
            if (key in state) {
                state[key] = !!val;
            }
        }
    }
};
