import Selection   from '@simonwep/selection-js';
import {eventPath} from '../../../../../js/utils';
import store       from '../../../../store';

const {selection, nodes} = store.state;
const strgPressed = e => e.ctrlKey || e.metaKey;

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
    validateStart(e) {
        const selected = selection.length;

        for (const el of eventPath(e)) {
            if (el instanceof HTMLElement) {
                const hash = el.getAttribute('data-hash');

                // Check if element contains a node-hash and try to resolve the corresponding node
                if (hash && !el.classList.contains('selected')) {
                    const selectedNode = nodes.find(v => v.id === hash);

                    if (selectedNode) {
                        el.classList.add('selected');

                        if (!strgPressed(e)) {
                            store.commit('selection/clear');
                        }

                        store.commit('selection/append', [selectedNode]);
                        return false;
                    }
                }
            }
        }

        if (e.button !== 2 || !selected) {
            return true;
        } else if (selected === 1) {
            store.commit('selection/clear');
            return true;
        }

        return false;
    },

    onStart({originalEvent}) {

        // Every non-ctrlKey causes a selection reset
        if (!originalEvent.ctrlKey) {
            store.commit('selection/clear');
            this.clearSelection();
        }
    },

    onSelect({selectedElements, originalEvent, target}) {
        if (!originalEvent.ctrlKey && !originalEvent.metaKey) {
            store.commit('selection/clear');
            for (const el of selectedElements) {
                el.classList.remove('selected');
            }

            this.clearSelection();
        }

        const targetHash = target.getAttribute('data-hash');
        const selected = target.classList.contains('selected');
        if (selected && selection.length) {
            this.removeFromSelection(target);
        } else {
            const selectedNode = nodes.find(v => v.id === targetHash);

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
        const selectedNodes = nodes.filter(v => selectedHashes.includes(v.id));
        store.commit('selection/append', selectedNodes);
    }
});
