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
    boundaries: ['.list']
}).on('beforestart', ({inst, oe}) => {
    if (strgPressed(oe)) {
        return;
    }

    for (const el of eventPath(oe)) {
        if (el instanceof HTMLElement) {
            const hash = el.getAttribute('data-hash');

            // Check if element contains a node-hash and try to resolve the corresponding node
            if (hash && !el.classList.contains('selected')) {
                const selectedNode = nodes.find(v => v.id === hash);

                if (selectedNode) {
                    el.classList.add('selected');
                    store.commit('selection/clear');
                    store.commit('selection/append', [selectedNode]);
                    inst.clearSelection();
                    inst.select(el);
                    inst.keepSelection();
                    return false;
                }
            }
        }
    }

    const selected = selection.length;
    if (oe.button !== 2 || !selected) {
        return;
    } else if (selected === 1) {
        store.commit('selection/clear');
        return;
    }

    return false;
}).on('start', ({inst, oe}) => {

    // Every non-ctrlKey causes a selection reset
    if (!strgPressed(oe)) {
        store.commit('selection/clear');
        inst.clearSelection();
    }
}).on('move', ({changed: {added, removed}}) => {

    /**
     * Only add / remove selected class to increase selection performance.
     */
    added.forEach(v => v.classList.add('selected'));
    removed.forEach(v => v.classList.remove('selected'));
}).on('stop', ({selected}) => {

    /**
     * Every element has a data-hash property wich is used
     * to find the selected nodes. Find these and append they
     * to the current selection.
     */
    const selectedHashes = selected.map(v => v.getAttribute('data-hash'));
    const selectedNodes = nodes.filter(v => selectedHashes.includes(v.id));
    store.commit('selection/append', selectedNodes);
});
