// Config stuff
import {visibleNodesLimit} from '../../../../../../../config/config';

export default {

    methods: {
        scroll({target}) {
            if (target.scrollHeight - (target.scrollTop + target.offsetHeight) < 25) {
                this.increaseVisibleArea();
            }
        },

        increaseVisibleArea() {
            if (this.dirLimit < this.nodes.dir.length) {
                this.dirLimit += visibleNodesLimit;
                return true;
            }

            if (this.fileLimit < this.nodes.file.length) {
                this.fileLimit += visibleNodesLimit;
                return true;
            }

            return false;
        },

        riseVisibleArea() {
            const {list} = this.$refs;
            list.scrollTop = 0;

            const check = () => {
                requestAnimationFrame(() => {
                    if ((list.scrollHeight - list.offsetHeight) < 100 && this.increaseVisibleArea()) {
                        check();
                    }
                });
            };

            check();
        },

        updateLocation(node) {
            const update = () => {
                this.$store.commit('setActiveTab', 'home');
                this.$store.commit('location/update', node);
            };

            // If node has been moved to trash restore it
            if (node.bin) {
                this.$store.dispatch('nodes/restore', [node]).then(update);
            } else {
                update();
            }
        },

        renameNode(evt, node) {
            this.$store.commit('editable/clear');

            // Try to rename, restore previous value if failed
            this.$store.dispatch('nodes/rename', {
                node,
                newName: evt.target.innerHTML
            }).catch(() => {
                evt.target.innerHTML = node.name;
            });
        },

        select(evt, node) {
            const state = this.$store.state;

            /**
             * Clear selection if
             *  - User hasn't pressed the ctrlKey and used NOT right click (which would open the menu)
             *  - User used right click AND the node isn't already selected
             */
            if ((!evt.ctrlKey && evt.button !== 2) ||
                (evt.button === 2 && !state.selection.includes(node))) {
                this.$store.commit('selection/clear');
            } else if (evt.ctrlKey && evt.shiftKey) {

                // Select all nodes from 0 or an already selected to the target node
                const selection = state.selection;
                const nodes = this.nodes.dir.concat(this.nodes.file);

                // Find start and end point
                const [start, end] = [
                    selection.length ? nodes.indexOf(selection[0]) : 0,
                    nodes.indexOf(node)
                ].sort((a, b) => a - b);

                // Append rage-nodes to selection
                this.$store.commit('selection/append', nodes.slice(start, end + 1));
                return;
            }

            // Toggle
            const action = evt.button !== 2 && state.selection.includes(node) ? 'remove' : 'append';
            this.$store.commit(`selection/${action}`, [node]);
        }
    },

    watch: {
        nodes(newValue, oldValue) {

            // Mostly props get's changed. Update only if array lengths are changing
            if (newValue.dir.length !== oldValue.dir.length || newValue.file.length !== oldValue.file.length) {

                this.dirLimit = visibleNodesLimit;
                this.fileLimit = visibleNodesLimit;
                this.riseVisibleArea();
            }
        }
    }
};
