import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Modules
import {nodes} from './nodes';
import {location} from './location';
import {clipboard} from './clipboard';
import {selection} from './selection';
import {editable} from './editable';
import {colors} from './colors';
import {search} from './search';

export default new Vuex.Store({
    modules: {nodes, location, clipboard, selection, editable, colors, search},

    state: {
        debugScreen: false,
        viewType: 'grid',
        searchFilter: false,
        keyboardShortcuts: false
    },

    mutations: {

        debugScreen(state, type) {
            state.debugScreen = resolve(type, state.debugScreen);
        },

        keyboardShortcuts(state, type) {
            state.keyboardShortcuts = resolve(type, state.keyboardShortcuts);
        },

        searchFilter(state, type) {
            state.searchFilter = resolve(type, state.searchFilter);
        },

        setViewType(state, type) {

            // Validate
            if (type !== 'list' && type !== 'grid') {
                throw `Cannot perform setViewType in index. Type is "${type}"`;
            }

            state.viewType = type;
        }

    }
});


function resolve(t, val) {
    return t === 'toggle' ? !val : !!t;
}
