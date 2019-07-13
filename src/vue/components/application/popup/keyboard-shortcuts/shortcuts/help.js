import store from '../../../../../store';

export default {
    name: 'Help',
    shortcuts: [
        {
            keys: ['h', 'k'],
            action: 'Show keyboard shortcuts.',
            fn: () => store.commit('setActivePopup', 'KeyboardShortcuts')
        },
        {
            keys: ['h', 'f'],
            action: 'Show search filters.',
            fn: () => store.commit('setActivePopup', 'SearchFilters')
        }
    ]
};
