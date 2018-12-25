export default module => {

    // Copy store
    const initialState = JSON.parse(JSON.stringify(module.state));

    // Create mutations section if not present
    if (!module.mutations) {
        module.mutations = {};
    }

    // Print warning if reset is already defined
    if (module.mutations.reset) {
        /* eslint-disable no-console */
        console.warn('Reset mutation will be overriden.');
    }

    // Inject reset mutation
    module.mutations.reset = function (state) {
        Object.assign(state, initialState);
    };

    return module;
}
