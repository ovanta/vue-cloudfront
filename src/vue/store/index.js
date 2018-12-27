import Vue  from 'vue';
import Vuex from 'vuex';

// Config
import config from '../../../config/config.json';

// Server-related nodes
import {nodes} from './app/nodes';
import {auth}  from './app/auth';
import {user}  from './app/user';

// Virtual modules act only as visual helpers / representation
import {location}    from './virtual/location';
import {clipboard}   from './virtual/clipboard';
import {selection}   from './virtual/selection';
import {editable}    from './virtual/editable';
import {search}      from './virtual/search/search';
import {tooltip}     from './virtual/tooltip';
import {filepreview} from './virtual/filepreview';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds an array of nodes
        nodes,

        // Holds a session key
        auth,

        // Holds user related content
        user,

        // Holds a single node where you are currently
        location,

        /**
         * Holds an array of nodes which are currently in the clipbord, including a type
         * string which defines whenever it's a copy or move action
         */
        clipboard,

        // Holds an array of nodes which are currently selected
        selection,

        // Holds a single node which is currently editable
        editable,

        // Holds a serch result and is also responsible for performing a search
        search,

        // Holds informations about the current tooltip, is used in combination with the v-tooltip directive
        tooltip,

        // Holds nodes which are currently open in the file preview
        filepreview
    },

    state: {

        // UI Props
        viewType: 'grid',
        activeTab: 'home',
        activePopup: null,

        // Amount of how many requests are currently active
        requestsActive: 0
    },

    mutations: {

        setActivePopup(state, popup) {
            state.activePopup = popup;
        },

        setActiveTab(state, tab) {
            state.activeTab = tab;
        },

        setViewType(state, type) {

            // Validate
            if (type !== 'list' && type !== 'grid') {
                throw `Cannot perform 'setViewType' in index. 'type' is '${type}' but only 'grid' and 'list' are possible`;
            }

            state.viewType = type;
        }
    },

    actions: {

        /**
         * Request proxy
         *
         * @param state
         * @param route API endpoint
         * @param body JSON Bddy
         * @returns {Promise<Response | Never>}
         */
        async fetch({state}, {route, body}) {
            state.requestsActive++;

            return fetch(`${config.apiEndPoint}/${route}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(async v => {
                const {error, data} = await v.json();

                if (error) {
                    throw error;
                }

                state.requestsActive--;
                return data;
            }).catch(v => {
                state.requestsActive--;
                throw v;
            });
        },

        /**
         * Uploads files
         *
         * @param parent Target directory
         * @param dataTransfer drop dataTrasnsfer object
         */
        async upload({state}, {parent, dataTransfer: {files, items}}) {
            state.requestsActive++;

            // Check if browser supports folder - dropping
            if (items.length && (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry)) {
                const getAsEntryFuncName = (DataTransferItem.prototype.webkitGetAsEntry || DataTransferItem.prototype.getAsEntry).name;

                const traverseFileTree = async (parent, item) => {

                    if (item.isFile) {

                        // Upload file file
                        const fileObj = await new Promise((resolve, reject) => item.file(resolve, reject));
                        if (fileObj) {
                            await this.dispatch('uploadFile', {parent, files: fileObj});
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

                state.requestsActive--;
                return this.dispatch('nodes/update', {keepLocation: true});
            } else {
                return this.$dispatch('uploadFile', {parent, files}).then(() => {
                    state.requestsActive--;
                    return this.dispatch('nodes/update', {keepLocation: true});
                }).catch(() => {
                    // TODO: Handle error?
                    state.requestsActive--;
                });
            }
        },

        /**
         * Responsible to upload single files
         * @returns {Promise<void>}
         */
        async uploadFile({state}, {parent, files}) {

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
            return fetch(`${config.apiEndPoint}/upload?apikey=${state.auth.apikey}&parent=${parent.id}`, {
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
         * @param node
         * @returns {Promise<void>}
         */
        async download({state}, {node}) {
            const link = document.createElement('a');
            link.download = node.name;
            link.href = `${config.apiEndPoint}/download?id=${node.id}&apikey=${state.auth.apikey}`;
            link.click();
        }

    }

});
