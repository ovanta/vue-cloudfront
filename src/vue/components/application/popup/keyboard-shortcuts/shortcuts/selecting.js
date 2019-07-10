import store from '../../../../../store';

const {state} = store;
const {selection} = state;

export default {
    name: 'Selecting',
    shortcuts: [
        {
            keys: ['Control', 'Shift'],
            action: 'Select everything up to current element.'
            // Handled by selectionjs
        },
        {
            keys: ['Control', 'a'],
            action: 'Select everything.',
            fn({nodes}) {

                // Select all nodes which are currently under the current location
                const nodesMap = nodes();
                store.commit('selection/append', nodesMap.file.concat(nodesMap.dir));
            }
        },
        {
            keys: ['s', 'd'],
            action: 'Select directories.',
            fn({nodes}) {

                // Clear selection to remove previously selected files
                store.commit('selection/clear');

                // Select all folders which are currently under the current location
                store.commit('selection/append', nodes().dir);
            }
        },
        {
            keys: ['s', 'f'],
            action: 'Select files.',
            fn({nodes}) {

                // Clear selection to remove previously selected folders
                store.commit('selection/clear');

                // Select all files which are currently under the current location
                store.commit('selection/append', nodes().file);
            }
        },
        {
            keys: ['s', 'i'],
            action: 'Invert selection.',
            fn({nodes}) {
                const nodesMap = nodes();
                const notSelected = nodesMap.file.concat(nodesMap.dir).filter(v => !selection.includes(v));

                // Clear selection
                store.commit('selection/clear');

                // Append previously not
                store.commit('selection/append', notSelected);
            }
        },
        {
            keys: ['Enter'],
            action: 'Enter first selected directory.',
            fn() {
                const firstFolder = selection.find(v => v.type === 'dir');

                if (firstFolder) {
                    this.$store.commit('location/update', firstFolder);
                }
            }
        },
        {
            keys: ['ArrowUp'],
            action: 'Select next element.'
        },
        {
            keys: ['ArrowDown'],
            action: 'Select previous element.'
        }
    ]
};

