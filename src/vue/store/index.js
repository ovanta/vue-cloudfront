import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// Modules
import {nodes} from './nodes';
import {location} from './location';

export default new Vuex.Store({
    modules: {nodes, location},
});
