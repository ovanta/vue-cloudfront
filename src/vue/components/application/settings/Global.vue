<template>
    <div class="global">

        <div class="setting">
            <p>Use SI Prefix to display file-size</p>
            <switch-button :value="settings.user.siPrefix" @input="change('siPrefix', $event)"/>
        </div>

        <div class="setting">
            <p>Delete everything forever</p>
            <switch-button :value="settings.user.immediateDeletion" @input="change('immediateDeletion', $event)"/>
        </div>

        <div class="setting">
            <p>Hide tooltips</p>
            <switch-button :value="settings.user.hideTooltips" @input="change('hideTooltips', $event)"/>
        </div>

    </div>
</template>

<script>

    // UI Stuff
    import SwitchButton from '../../../ui/input/SwitchButton';

    // Vuex
    import {mapState} from 'vuex';

    export default {

        components: {SwitchButton},

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

<style lang="scss" scoped>

    .global {

        .setting {
            @include flex(row, center, space-between);
            margin: 1em 0;

            p {
                @include font(600, 0.8em);
                color: $palette-asphalt;
                margin-right: 2em;
            }
        }
    }


</style>
