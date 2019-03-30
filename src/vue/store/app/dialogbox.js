export const dialogbox = {

    namespaced: true,

    state: {
        open: false,
        type: 'info',
        title: null,
        text: '',
        buttons: [],
        close: () => 0
    },

    mutations: {

        show(state, {title, type = 'info', text = '', buttons = [], onResolve = () => 0}) {
            Object.assign(state, {
                type, title, text, buttons,
                open: true,
                close(idx) {
                    state.open = false;
                    onResolve(idx);
                }
            });
        },

        close(state) {
            state.open = false;
        }
    }
};
