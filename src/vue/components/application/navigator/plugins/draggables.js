import Draggable from '../../../../../js/Draggable';

/**
 * Is responsible for everything around dragging
 * @param vue Vue instance
 * @param selectionjs Selectionjs instance
 * @returns {*}
 */
export default (vue, selectionjs) => new Draggable({
    draggable: '.file,.folder',
    include: '.selected',
    startThreshold: 4,
    target: '.folder',
    ghostLimit: 10,

    onDragStart() {

        /**
         * Disable dragging if search is active, the active menu-tab isn't home or user
         * is currently in list-view.
         */
        const {state} = vue.$store;
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
            const targetNode = vue.$store.state.nodes.find(v => v.type === 'folder' && v.hash === hash);

            const {selection} = vue.$store.state;
            if (targetNode && selection.length) {

                // Move elements
                vue.$store.dispatch('nodes/move', {
                    nodes: selection,
                    destination: targetNode
                }).then(() => {

                    // Clear selection
                    vue.$store.commit('selection/clear');
                });
            }

            // Remove class
            dropTarget.classList.remove('droppable');
        }

        // Re-enable selection
        selectionjs.enable();
    }
});
