import Vue  from 'vue';
import Vuex from 'vuex';

// Server-related nodes
import {nodes}    from './app/nodes';
import {auth}     from './app/auth';
import {userdata} from './app/userdata';

// Virtual modules act only as visual helpers / representation
import {location}  from './virtual/location';
import {clipboard} from './virtual/clipboard';
import {selection} from './virtual/selection';
import {editable}  from './virtual/editable';
import {search}    from './virtual/search';
import {tooltip}   from './virtual/tooltip';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {

        // Holds an array of nodes
        nodes,

        // Holds a session key
        auth,

        // Holds user related content
        userdata,

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
        tooltip
    },

    state: {

        // UI Props
        viewType: 'grid',
        showDebugScreen: false,
        activeTab: 'home',
        activePopup: null
    },

    mutations: {

        setActivePopup(state, popup) {
            state.activePopup = popup;
        },

        showDebugScreen(state, v) {
            state.showDebugScreen = v === 'toggle' ? !state.showDebugScreen : !!v;
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
    }
});
