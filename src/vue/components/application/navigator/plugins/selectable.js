import Selection from '@simonwep/selection-js';
import store     from '../../../../store';

/**
 * Is responsible for the selection area
 * @returns {*}
 */
export default new Selection({

    class: 'selection-area',

    startThreshold: 10,
    disableTouch: true,
    selectionAreaContainer: '#app',

    selectables: ['.file', '.dir'],
    startareas: ['.views'],
    boundaries: ['.list'],

    onStart(evt) {

        // Every non-ctrlKey causes a selection reset
        if (!evt.originalEvent.ctrlKey) {
            store.commit('selection/clear');
        }
    },

    onMove(evt) {
        const {changedElements} = evt;

        /**
         * Only add / remove selected class to increase selection performance.
         */
        changedElements.added.forEach(v => v.classList.add('selected'));
        changedElements.removed.forEach(v => v.classList.remove('selected'));
    },

    onStop(evt) {
        const {selectedElements} = evt;

        // Remove selected class, this is getting handled by vue
        selectedElements.forEach(v => v.classList.remove('selected'));

        /**
         * Every element has a data-hash property wich is used
         * to find the selected nodes. Find these and append they
         * to the current selection.
         */
        const selectedHashes = selectedElements.map(v => v.getAttribute('data-hash'));
        const selectedNodes = store.state.nodes.filter(v => selectedHashes.includes(v.id));
        store.commit('selection/append', selectedNodes);
    }
});
