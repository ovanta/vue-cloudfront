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
    modules: {nodes, location, clipboard, selection, editable, colors, search}
});
