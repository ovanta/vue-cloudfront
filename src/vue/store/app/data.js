import config from '../../../../config/config';

export const data = {

    namespaced: true,

    state: {},

    actions: {

        /**
         * Uploads files
         *
         * @param parent Target directory
         * @param dataTransfer drop dataTrasnsfer object
         */
        async upload({state, rootState}, {parent, dataTransfer: {files, items}}) {
            rootState.requestsActive++;

            // Check if browser supports folder - dropping
            if (items.length && (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry)) {
                const getAsEntryFuncName = (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry).name;
                const fileMap = new Map();

                const traverseFileTree = async (parent, item) => {
                    if (item.isFile) {

                        // Upload file file
                        const fileObj = await new Promise((resolve, reject) => item.file(resolve, reject));
                        if (fileObj) {

                            if (!fileMap.has(parent)) {
                                fileMap.set(parent, []);
                            }

                            fileMap.set(parent, fileMap.get(parent).concat([fileObj]));
                        } else {
                            // TODO: Handle error?
                        }

                    } else if (item.isDirectory) {

                        // Create node and rename it
                        const folderNode = await this.dispatch('nodes/createFolder', {parent, name: item.name});

                        // Resolve childs
                        await new Promise(resolve => item.createReader().readEntries(async entries => {

                            for (let i = 0; i < entries.length; i++) {
                                await traverseFileTree(folderNode, entries[i], item.name + '/');
                            }

                            resolve();
                        }));
                    }
                };

                for (let i = 0; i < items.length; i++) {
                    const item = items[i][getAsEntryFuncName]();
                    item && (await traverseFileTree(parent, item));
                }

                // Upload files
                for (const [parent, files] of fileMap) {
                    await this.dispatch('data/uploadFile', {parent, files});
                }

                rootState.requestsActive--;
                return this.dispatch('nodes/update', {keepLocation: true});
            } else {
                return this.$dispatch('data/uploadFile', {parent, files}).then(() => {
                    rootState.requestsActive--;
                    return this.dispatch('nodes/update', {keepLocation: true});
                }).catch(() => {
                    // TODO: Handle error?
                    rootState.requestsActive--;
                });
            }
        },

        /**
         * Responsible to upload single files
         * @returns {Promise<void>}
         */
        async uploadFile({state, rootState}, {parent, files}) {

            // Wrap into array if not already
            if (!Array.isArray(files)) {
                files = [files];
            }

            // Build form
            const formData = new FormData();
            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    formData.append(`${i}`, files[i]);
                }
            }

            // Upload
            return fetch(`${config.apiEndPoint}/upload?apikey=${rootState.auth.apikey}&parent=${parent.id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                body: formData
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
