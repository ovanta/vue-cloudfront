import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Modules
import {nodes} from './nodes';
import {location} from './location';
import {clipboard} from './clipboard';
import {selection} from './selection';
import {editable} from './editable';
import {colors} from './statics/colors';
import {search} from './search';

export default new Vuex.Store({
    modules: {nodes, location, clipboard, selection, editable, colors, search},

    state: {
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
            state.activeTab =tab;
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
