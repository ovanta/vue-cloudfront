import config            from '../../../../config/config';
import {fileSystemUtils} from '../../../js/utils';

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

            // Check if browser supports folder drag 'n drop
            if (items.length && (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry)) {
                const getAsEntryFuncName = (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry).name;
                const fileMap = {};

                if (files.length) {
                    files = Array.from(files);
                    state.upload.total += files.reduce((acc, cv) => cv.size + acc, 0);
                    fileMap[parent.id] = files;
                }

                const traverseFileTree = async (parent, item) => {

                    if (item.isFile) {

                        // Resolve item
                        const fileObj = await new Promise((resolve, reject) => item.file(resolve, reject));
                        if (fileObj) {

                            if (!(parent.id in fileMap)) {
                                fileMap[parent.id] = [];
                            }

                            // Check if file aready exists
                            const fileList = fileMap[parent.id];
                            if (!fileList.find(v => v.name === fileObj.name && v.size === fileObj.size && v.lastModified === fileObj.lastModified)) {

                                // Update total upload size and add file
                                state.upload.total += fileObj.size;
                                fileMap[parent.id].push(fileObj);
                            }
                        }
                    } else if (item.isDirectory) {

                        // Create folder
                        return this.dispatch('nodes/createFolder', {
                            parent, name: item.name
                        }).then(async folder => {

                            // Resolve childs
                            const entries = await fileSystemUtils.readEntries(item);
                            for (let i = 0; i < entries.length; i++) {
                                await traverseFileTree(folder, entries[i]);
                            }
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
                await this.dispatch('data/uploadFiles', fileMap);

                await Promise.all(promises);
                rootState.requestsActive--;
                this.commit('data/reset');
            } else {
                const reqObj = {};
                reqObj[parent] = files;

                // Upload single files
                return this.dispatch('data/uploadFiles', reqObj).then(newNodes => {
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
        async uploadFiles({state, rootState}, data) {

            // Build form
            const formData = new FormData();
            formData.append('apikey', rootState.auth.apikey);
            for (const [parent, files] of Object.entries(data)) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];

                    // Check if file is REALLY a file
                    if (await fileSystemUtils.isFile(file)) {
                        formData.append(`${parent}-${i}`, file);
                    } else {
                        state.upload.total -= file.size;
                    }
                }
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
                    `${config.apiEndPoint}/upload`,
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
