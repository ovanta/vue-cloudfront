import store from '../../../../../store';

const {state} = store;

export default {
    name: 'General',
    shortcuts: [
        {
            keys: ['r'],
            action: 'Refresh everything.',
            fn: () => store.dispatch('nodes/update', {keepLocation: true})
        },
        {
            keys: ['v', 'l'],
            action: 'Change view to list.',
            fn: () => store.commit('setViewType', 'list')
        },
        {
            keys: ['v', 'g'],
            action: 'Change view to grid.',
            fn: () => store.commit('setViewType', 'grid')
        },
        {
            keys: ['j', 'h'],
            action: 'Switch to home tab.',
            fn: () => store.commit('setActiveTab', 'home')
        },
        {
            keys: ['j', 'm'],
            action: 'Switch to starred folder / files.',
            fn: () => store.commit('setActiveTab', 'marked')
        },
        {
            keys: ['j', 's'],
            action: 'Switch to settings',
            fn: () => store.commit('setActiveTab', 'settings')
        },
        {
            keys: ['j', 't'],
            action: 'Switch to bin.',
            fn: () => store.commit('setActiveTab', 'bin')
        },
        {
            keys: ['j', 'd'],
            action: 'Switch to dashboard.',
            fn({mediaDevice}) {
                if (mediaDevice !== 'mobile') {
                    store.commit('setActiveTab', 'dashboard');
                }
            }
        },
        {
            keys: ['Shift', 'Tab'],
            action: 'Switch tabs.',
            fn({event}) {
                const tabs = ['dashboard', 'home', 'marked', 'bin', 'settings'];
                const index = tabs.indexOf(state.activeTab) + 1;

                // Switch tab, rotate if end is reached
                store.commit('setActiveTab', tabs[index === tabs.length - 1 ? 0 : index]);
                event.preventDefault();
            }
        },
        {
            keys: ['Backspace'],
            action: 'Go up in hierarchy.',
            fn() {
                if (state.activeTab === 'home') {
                    store.commit('location/goUp');
                }
            }
        },
        {
            keys: ['Escape'],
            action: 'Close any popup like menu or this page.',
            fn() {

                // Clear selection
                store.commit('selection/clear');

                // Close open popup
                store.commit('setActivePopup', null);

                // Close confirmation dialog
                store.commit('dialogbox/close');

                // Close editable node
                store.commit('editable/clear');

                // Close filepreview
                store.commit('filepreview/clear');
            }
        }
    ]
};
