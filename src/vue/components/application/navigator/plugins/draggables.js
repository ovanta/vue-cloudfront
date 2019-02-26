import Draggable from '../../../../../js/Draggable';
import store     from '../../../../store';

/**
 * Is responsible for everything around dragging
 * @param selectionjs Selectionjs instance
 * @returns {*}
 */
export default selectionjs => new Draggable({
    draggable: '.file,.dir',
    include: '.selected',
    disableTouch: true,
    startThreshold: 4,
    target: '.dir,.node',
    ghostLimit: 10,

    mapGhost(element) {

        // Remove inline file-preview
        const embed = element.querySelector('.embed-file-preview');

        if (embed) {
            embed.parentElement.removeChild(embed);
        }

        return element;
    },

    onDragStart() {

        /**
         * Disable dragging if search is active, the active menu-tab isn't home or user
         * is currently in list-view.
         */
        const {state} = store;
        if (state.search.active ||
            state.activeTab !== 'home' ||
            state.viewType !== 'grid') {
            return this.cancel();
        }

        /**
         * If user starts dragging, disable and
         * cancel current selection processes.
         */
        selectionjs.disable();
        selectionjs.cancel();
    },

    onDragMove(op) {
        const {dropTarget, lastDropTarget} = op;

        // Check if the current drop-target isn't selected
        if (dropTarget && !dropTarget.classList.contains('selected')) {
            dropTarget.classList.add('droppable');
        }

        // Remove droppable class from last drop-element
        lastDropTarget && lastDropTarget.classList.remove('droppable');
    },

    onDragEnd(op) {
        const {dropTarget} = op;

        // Check if dropTarget has a data-hash attribute and perform move-operation
        if (dropTarget && dropTarget.hasAttribute('data-hash')) {
            const hash = dropTarget.getAttribute('data-hash');

            // Find target node
            const targetNode = store.state.nodes.find(v => v.type === 'dir' && v.id === hash);

            const {selection} = store.state;
            if (targetNode && selection.length) {

                // Move elements
                store.dispatch('nodes/move', {
                    nodes: selection,
                    destination: targetNode
                }).then(() => {

                    // Clear selection
                    store.commit('selection/clear');
                });
            }

            // Remove class
            dropTarget.classList.remove('droppable');
        }

        // Re-enable selection
        selectionjs.enable();
    }
});
