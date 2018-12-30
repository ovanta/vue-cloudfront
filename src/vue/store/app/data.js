import config from '../../../../config/config';

export const data = {

    namespaced: true,

    state: {

        // Upload progress informations
        upload: {
            active: false,
            total: 0, // Total upload bytes
            done: 0 // Bytes uploaded so far
        }
    },

    mutations: {

        /**
         * Resets the module state
         * @param state
         */
        reset(state) {
            state.upload.active = false;
            state.upload.total = 0;
            state.upload.done = 0;
        }
    },

    actions: {

        /**
         * Uploads files
         *
         * @param parent Target directory
         * @param dataTransfer drop dataTrasnsfer object
         */
        async upload({state, rootState}, {parent, dataTransfer: {files, items}}) {
            state.upload.active = true;
            rootState.requestsActive++;

            // See https://stackoverflow.com/a/25095250/7664765
            files = Array.from(files).filter(v => v.type || v.size % 4096 !== 0);

            // Check if browser supports folder - dropping
            if (items.length && (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry)) {
                const getAsEntryFuncName = (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry).name;
                const fileMap = new Map();

                if (files.length) {
                    fileMap.set(parent, files);
                }

                const traverseFileTree = async (parent, item) => {

                    // See https://stackoverflow.com/a/25095250/7664765
                    if (item.isFile && (item.size % 4096) !== 0) {

                        // Upload file file
                        const fileObj = await new Promise((resolve, reject) => item.file(resolve, reject));

                        if (fileObj) {

                            if (!fileMap.has(parent)) {
                                fileMap.set(parent, []);
                            }

                            // Update total upload size and add file
                            state.upload.total += fileObj.size;
                            fileMap.set(parent, fileMap.get(parent).concat([fileObj]));
                        } else {
                            // TODO: Handle error?
                        }
                    } else if (item.isDirectory) {

                        // Create node and rename it
                        const folderNode = await this.dispatch('nodes/createFolder', {parent, name: item.name});

                        // Resolve childs
                        await new Promise(resolve => {
                            item.createReader().readEntries(async entries => {

                                for (let i = 0; i < entries.length; i++) {
                                    await traverseFileTree(folderNode, entries[i]);
                                }

                                resolve();
                            });
                        });
                    }
                };

                const entryFolderPromises = [];
                for (let i = 0; i < items.length; i++) {
                    const entry = items[i][getAsEntryFuncName]();
                    entry && (entryFolderPromises.push(traverseFileTree(parent, entry)));
                }

                await Promise.all(entryFolderPromises);

                // Upload files
                for (const [parent, files] of fileMap.entries()) {
                    await this.dispatch('data/uploadFile', {parent, files});
                }

                rootState.requestsActive--;
                this.commit('data/reset');

                // Update nodes
                return this.dispatch('nodes/update', {keepLocation: true});
            } else {
                return this.$dispatch('data/uploadFile', {parent, files}).then(() => {
                    this.commit('data/reset');
                    rootState.requestsActive--;

                    // Update nodes
                    return this.dispatch('nodes/update', {keepLocation: true});
                }).catch(() => {
                    // TODO: Handle error?
                    this.commit('data/reset');
                    rootState.requestsActive--;
                });
            }
        },

        /**
         * Responsible to upload single files
         * @returns {Promise<void>}
         */
        async uploadFile({state, rootState}, {parent, files}) {

            if (!files.length) {
                return Promise.resolve();
            }

            // Build form
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append(`${i}`, files[i]);
            }

            /**
             * Currently fetch does not support upload-progression
             * see https://stackoverflow.com/questions/35711724/upload-progress-indicators-for-fetch
             * So instead use xmlhttprequest to track the upload progress
             */
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                let lastDone = 0;
                xhr.upload.onprogress = e => {
                    const done = e.position || e.loaded;
                    state.upload.done += done - lastDone;
                    lastDone = done;
                };

                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        xhr.status === 200 ? resolve() : reject();
                    }
                };

                xhr.open(
                    'POST',
                    `${config.apiEndPoint}/upload?apikey=${rootState.auth.apikey}&parent=${parent.id}`,
                    true
                );

                xhr.send(formData);
            });
        },

        /**
         * Initiates a download
         * @param state
         * @param rootState
         * @param node
         * @returns {Promise<void>}
         */
        async download({rootState}, {node}) {
            const link = document.createElement('a');
            link.download = node.name;
            link.href = `${config.apiEndPoint}/download?id=${node.id}&apikey=${rootState.auth.apikey}`;
            link.click();
        }
    }
};
