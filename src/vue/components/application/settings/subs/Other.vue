<template>
    <div class="appereance">

        <div class="setting">
            <article>
                If you create a new folder (or if you upload some), folders automatically get a color assigned.
                Here you can chose which color should be used.
            </article>

            <div class="input">
                <p>Choose a default folder color</p>
                <pickr :color="settings.user.defaultFolderColor"
                       @save="change('defaultFolderColor', $event)"/>
            </div>
        </div>

    </div>
</template>

<script>

    // UI Stuff
    import Pickr from '../../../../ui/input/Pickr';

    // Vuex
    import {mapState} from 'vuex';

    export default {

        components: {Pickr},

        data() {
            return {};
        },

        computed: {
            ...mapState(['settings'])
        },

        methods: {
            change(prop, newVal) {
                this.$store.dispatch('settings/change', state => {
                    state.user[prop] = newVal;
                    return state;
                });
            }
        }
    };

</script>
