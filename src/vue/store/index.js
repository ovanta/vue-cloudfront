import Vue  from 'vue';
import Vuex from 'vuex';

// Config
import config from '../../../config/config.json';

// Server-related nodes
import {nodes}     from './app/nodes';
import {auth}      from './app/auth';
import {stats}     from './app/stats';
import {data}      from './app/data';
import {dialogbox} from './virtual/dialogbox';

// Virtual modules act only as visual helpers / representation
import {location}    from './virtual/location';
import {clipboard}   from './virtual/clipboard';
import {selection}   from './virtual/selection';
import {editable}    from './virtual/editable';
import {search}      from './virtual/search/search';
import {tooltip}     from './virtual/tooltip';
import {filepreview} from './virtual/filepreview';
import {share}       from './virtual/share';
import {errors}      from './virtual/errors';
import {connection}  from './virtual/connection';
import {elements}    from './virtual/elements';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds an array of nodes
        nodes,

        // Holds a session key
        auth,

        // Holds user related content
        stats,

        // Responsible for uploading / downloading data
        data,

        // Holds a single node where you are currently
        location,

        // Contains informations about the current dialog box state
        dialogbox,

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
        filepreview,

        // Holds nodes which are currently in the share popup
        share,

        // Logs all kind of console logs
        errors,

        // Everything around ethernet and sockets
        connection,

        // Global available elements
        elements
    },

    state: {

        // UI Props
        viewType: 'grid',
        activeTab: 'dashboard',
        activePopup: null,

        // Amount of how many requests are currently active
        requestsActive: 0
    },

    getters: {

        /**
         * Returns a function which takes a node which returns
         * a url to this specific file using the current APIKey.
         *
         * @returns {function(*): string}
         */
        buildStaticUrl(state) {
            return node => `${config.apiEndPoint}/s/${encodeURIComponent(node.name)}?id=${node.id}&apikey=${state.auth.apikey}`;
        }
    },

    mutations: {

        setActivePopup(state, popup) {
            state.activePopup = popup;
        },

        setActiveTab(state, tab) {

            // Clear / cancel search
            this.dispatch('search/update', null);
            state.activeTab = tab;
        },

        setViewType(state, type) {
            state.viewType = type;
        }
    },

    actions: {

        /**
         * Request proxy
         *
         * @param state
         * @param silent
         * @param raw
         * @param route API endpoint
         * @param body JSON Bddy
         * @returns {Promise<Response | Never>}
         */
        async fetch({state}, {silent = false, raw = false, route, body}) {

            if (!navigator.onLine) {
                return Promise.reject('User is currently offline');
            }

            !silent && state.requestsActive++;
            return fetch(`${config.apiEndPoint}/${route}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(body)
            }).then(async response => {

                if (raw) {
                    return {
                        response, done: () => state.requestsActive--
                    };
                }

                if (!response.ok) {

                    /* eslint-disable no-console */
                    console.warn(response);
                    !silent && state.requestsActive--;
                    throw 'Fetch failed';
                }

                const {error, data} = await response.json();
                !silent && state.requestsActive--;

                if (error) {
                    throw error;
                }

                return data;
            });
        }
    }
});
