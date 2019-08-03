import {visibleNodesChunkSize} from '../../../../../../config/config';
import {mapState}              from 'vuex';

export default {

    methods: {
        scroll({target}) {
            if (target.scrollHeight - (target.scrollTop + target.offsetHeight) < 25) {
                this.increaseVisibleArea();
            }
        },

        increaseVisibleArea() {
            if (this.dirLimit < this.nodes.dir.length) {
                this.dirLimit += visibleNodesChunkSize;
                return true;
            }

            if (this.fileLimit < this.nodes.file.length) {
                this.fileLimit += visibleNodesChunkSize;
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

            evt.stopPropagation();
        }
    },

    computed: {
        ...mapState(['selection', 'editable', 'clipboard']),

        cutted() {
            const {clipboard} = this;
            return clipboard.type === 'move' ? clipboard.nodes : [];
        },

        croppedNodes() {
            const {fileLimit, dirLimit} = this;

            const createSubPart = (type, limit) => {
                const nodes = this.nodes[type];
                const amount = nodes.length > limit ? limit : nodes.length;
                const list = new Array(amount);

                for (let i = 0; i < amount; i++) {
                    list[i] = nodes[i];
                }

                return list;
            };

            return {
                file: createSubPart('file', fileLimit),
                dir: createSubPart('dir', dirLimit)
            };
        }
    },

    watch: {
        nodes(newValue, oldValue) {

            // Mostly props get's changed. Update only if array lengths are changing
            if (newValue.dir.length !== oldValue.dir.length || newValue.file.length !== oldValue.file.length) {

                this.dirLimit = visibleNodesChunkSize;
                this.fileLimit = visibleNodesChunkSize;
                this.riseVisibleArea();
            }
        }
    }
};
