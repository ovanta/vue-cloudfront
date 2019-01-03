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

            // Check if browser supports folder - dropping
            if (items.length && (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry)) {
                const getAsEntryFuncName = (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry).name;
                const fileMap = new Map();

                if (files.length) {
                    files = Array.from(files);
                    state.upload.total += files.reduce((acc, cv) => cv.size + acc, 0);
                    fileMap.set(parent, files);
                }

                const traverseFileTree = async (parent, item) => {

                    if (item.isFile) {

                        // Resolve item
                        const fileObj = await new Promise((resolve, reject) => item.file(resolve, reject));

                        if (fileObj) {

                            if (!fileMap.has(parent)) {
                                fileMap.set(parent, []);
                            }

                            const fileList = fileMap.get(parent);

                            // Check if file does aready exists
                            if (!fileList.find(v => v.name === fileObj.name && v.size === fileObj.size && v.lastModified === fileObj.lastModified)) {

                                // Update total upload size and add file
                                state.upload.total += fileObj.size;
                                fileMap.set(parent, fileList.concat([fileObj]));
                            }
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

                let promises = [];
                for (let i = 0; i < items.length; i++) {
                    const entry = items[i][getAsEntryFuncName]();
                    entry && (promises.push(traverseFileTree(parent, entry)));
                }

                await Promise.all(promises);

                // Upload files
                promises = [];
                for (const [parent, files] of fileMap.entries()) {
                    promises.push(
                        this.dispatch('data/uploadFiles', {parent, files})
                    );
                }

                await Promise.all(promises);

                rootState.requestsActive--;
                this.commit('data/reset');
            } else {
                return this.dispatch('data/uploadFiles', {parent, files}).then(newNodes => {
                    this.commit('data/reset');
                    rootState.requestsActive--;
                    this.commit('nodes/put', {nodes: newNodes});
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
        async uploadFiles({state, rootState}, {parent, files}) {

            // See https://stackoverflow.com/a/20874931/7664765 and https://stackoverflow.com/a/8857445/7664765
            const isFile = file => new Promise(resolve => {

                // Everything is assumed and I hope it works
                if (!file.type && file.size % 4096 === 0) {
                    resolve(false);
                } else if (file.size > 1048576) {
                    resolve(true);
                } else {
                    const reader = new FileReader();
                    reader.onload = () => resolve(true);
                    reader.onerror = () => resolve(false);
                    reader.readAsArrayBuffer(file);
                }
            });

            const realFiles = [];
            for (const file of files) {
                if (await isFile(file)) {
                    realFiles.push(file);
                } else {
                    state.upload.total -= file.size;
                }
            }

            if (!realFiles.length) {
                return Promise.resolve();
            } else {
                files = realFiles;
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
                        if (xhr.status === 200) {

                            // Parse and validate response
                            const {error, data} = JSON.parse(xhr.responseText);

                            if (error) {
                                reject();
                            } else {
                                this.commit('nodes/put', {nodes: data});
                                resolve();
                            }

                        } else {
                            reject('Request failed');
                        }
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
            document.body.appendChild(link);
            link.download = node.name;
            link.href = `${config.apiEndPoint}/download?id=${node.id}&apikey=${rootState.auth.apikey}`;
            link.click();
            document.body.removeChild(link);
        }
    }
};
