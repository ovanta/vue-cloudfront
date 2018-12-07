import Selection from '@simonwep/selection-js';

/**
 * Is responsible for the selection area
 * @param vue Vue instance
 * @returns {*}
 */
export default vue => new Selection({

    class: 'selection-area',

    // Single click is handled by GridView and ListView
    singleClick: false,

    startThreshold: 10,

    selectables: ['.file', '.folder'],
    startareas: ['.views'],
    boundaries: ['.views'],

    onStart(evt) {

        // Every non-ctrlKey causes a selection reset
        if (!evt.originalEvent.ctrlKey) {
            vue.$store.commit('selection/clear');
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
        const selectedNodes = vue.$store.state.nodes.filter(v => selectedHashes.includes(v.hash));
        vue.$store.commit('selection/append', selectedNodes);
    }
});
