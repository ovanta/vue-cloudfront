import store from '../../../../../store';

const {state} = store;
const {selection, activeTab, clipboard} = state;

export default {
    name: 'Actions',
    shortcuts: [
        {
            keys: ['Control', 'x'],
            action: 'Cut folder / files.',
            fn() {
                if (selection.length) {

                    // Save to clipboard
                    store.commit('clipboard/clear');
                    store.commit('clipboard/insert', {
                        nodes: selection,
                        type: 'move'
                    });
                }
            }
        },
        {
            keys: ['Control', 'c'],
            action: 'Copy folder / files.',
            fn() {
                if (activeTab === 'home' && selection.length) {

                    // Save to clipboard
                    store.commit('clipboard/clear');
                    store.commit('clipboard/insert', {
                        nodes: selection,
                        type: 'copy'
                    });
                }
            }
        },
        {
            keys: ['Control', 'v'],
            action: 'Paste folder / files.',
            fn() {
                if (clipboard.nodes.length) {

                    // Move elements
                    store.dispatch(`nodes/${state.clipboard.type}`, {
                        nodes: clipboard.nodes,
                        destination: state.location.node
                    });

                    // Keep initially copied nodes in clipboard
                    if (clipboard.type !== 'copy') {

                        // Clear clipboard
                        store.commit('clipboard/clear');
                    }
                }
            }
        },
        {
            keys: ['Control', 'f'],
            action: 'Search.',
            fn({event}) {
                store.commit('setActivePopup', null);
                store.commit('setActiveTab', 'home');

                // Focus & select input field
                requestAnimationFrame(() => {
                    const {searchBarInputField} = state.elements;
                    searchBarInputField.focus();
                    searchBarInputField.select();
                });

                event.preventDefault();
            }
        },
        {
            keys: ['n', 's'],
            action: 'Share.',
            fn() {
                if (selection.length === 1 && selection[0].type === 'file') {
                    store.commit('setActivePopup', 'ShareViaLink');
                    store.commit('share/set', selection[0]);
                }
            }
        },
        {
            keys: ['z', 'i'],
            action: 'Create zip file out of selection.',
            fn() {
                if (selection.length) {
                    store.dispatch('nodes/zip', {nodes: selection});
                }
            }
        },
        {
            keys: ['n', 'f'],
            action: 'Create new folder.',
            fn({event}) {

                // Create a folder and immediatly make it editable
                store.dispatch('nodes/createFolder', {
                    parent: state.location.node
                }).then(folderNode => {
                    store.commit('editable/set', folderNode);
                });

                // Prevent setting the letter 'f' as folder name because the freshly created
                // folder is editable.
                event.preventDefault();
            }
        },
        {
            keys: ['e', 'n'],
            action: 'Edit the name.',
            fn({event}) {
                if (selection.length) {
                    store.commit('editable/set', selection[0]);
                    event.preventDefault();
                }
            }
        },
        {
            keys: ['m', 'a'],
            action: 'Marks selected files / folders.',
            fn: () => store.dispatch('nodes/addMark', selection)
        },
        {
            keys: ['m', 'r'],
            action: 'Removes the mark from selected files / folders.',
            fn: () => store.dispatch('nodes/removeMark', selection)
        },
        {
            keys: ['Delete'],
            action: 'Move selected files / folders to the bin.',
            fn: () => store.dispatch('nodes/delete', {nodes: selection})
        },
        {
            keys: ['Delete', 'Shift'],
            action: 'Permanently delete selected files / folders.',
            fn() {
                store.dispatch('nodes/delete', {
                    nodes: selection,
                    permanently: true
                });
            }
        }
    ]
};
