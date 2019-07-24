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

    // Don't start selection if user opened the context-menu
    validateStart: e => {
        const selected = store.state.selection.length;

        if (e.button !== 2 || !selected) {
            return true;
        } else if (selected === 1) {
            store.commit('selection/clear');
            return true;
        }

        return false;
    },

    onStart(evt) {

        // Every non-ctrlKey causes a selection reset
        if (!evt.originalEvent.ctrlKey) {
            store.commit('selection/clear');
            this.clearSelection();
        }
    },

    onSelect({selectedElements, originalEvent, target}) {
        const selected = target.classList.contains('selected');
        const targetHash = target.getAttribute('data-hash');

        if (!originalEvent.ctrlKey && !originalEvent.metaKey) {
            store.commit('selection/clear');

            for (const el of selectedElements) {
                el.classList.remove('selected');
            }

            this.clearSelection();
        }

        if (selected) {
            this.removeFromSelection(target);
        } else {
            const selectedNode = store.state.nodes.find(v => v.id === targetHash);

            if (selectedNode) {
                store.commit('selection/append', [selectedNode]);
                this.keepSelection();
            }
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

    onStop({selectedElements}) {

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
