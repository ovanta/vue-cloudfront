import Vue from 'vue';
import Vuex from 'vuex';

// Server-related nodes
import {nodes} from './nodes';

// Virtual modules act only as visual helpers / representation
import {location} from './virtual/location';
import {clipboard} from './virtual/clipboard';
import {selection} from './virtual/selection';
import {editable} from './virtual/editable';
import {search} from './virtual/search';

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {nodes, location, clipboard, selection, editable, search},

    state: {

        // Gets updated every second
        now: Date.now(),

        // UI Props
        viewType: 'grid',
        skipIntroBoxes: false,
        showDebugScreen: false,
        activeTab: 'home',
        activePopup: null
    },

    mutations: {

        setActivePopup(state, popup) {
            state.activePopup = popup;
        },

        skipIntroBoxes(state, v) {
            state.skipIntroBoxes = !!v;
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
        },

        updateTimer(state) {
            state.now = Date.now();
        }
    }
});
