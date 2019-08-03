<template>
    <div class="appereance">

        <div class="setting">
            <article>
                Using the SI Prefix means using the Internationla System of Units and therefore representing
                all number with the base of <kbd>10</kbd> instead of <kbd>2</kbd>
            </article>

            <div class="input">
                <p>Use SI Prefix to display file-size</p>
                <switch-button :value="settings.user.siPrefix" @input="change('siPrefix', $event)"/>
            </div>
        </div>

        <div class="setting">
            <article>
                Deleting something while pressing the <kbd>shift</kbd> key or removing it from the bin
                means it's ereased forever. Check this if you want to delete everything by default forever (makes the bin redundant)
            </article>

            <div class="input">
                <p>Delete everything forever</p>
                <switch-button :value="settings.user.immediateDeletion" @input="change('immediateDeletion', $event)"/>
            </div>
        </div>

        <div v-if="$store.state.features.preferredColorScheme.available" class="setting">
            <article>
                Some operation systems have an option where you can decide if you wish to use a dark or light color-theme.
                Enable this setting to use the theme of your OS.
            </article>

            <div class="input">
                <p>Use system color scheme</p>
                <switch-button :value="settings.user.usePreferredColorScheme" @input="change('usePreferredColorScheme', $event)"/>
            </div>

            <blockquote v-if="settings.user.usePreferredColorScheme">
                Currently used: <b>{{ $store.state.features.preferredColorScheme.value }}</b>
            </blockquote>
        </div>

        <div class="setting">
            <article>
                Tooltips help you to get a small hint why and for what a input field is. Disable it if you want a
                less interrupted experience.
            </article>

            <div class="input">
                <p>Hide tooltips</p>
                <switch-button :value="settings.user.hideTooltips" @input="change('hideTooltips', $event)"/>
            </div>
        </div>

    </div>
</template>

<script>

    // UI Stuff
    import SwitchButton from '../../../../ui/input/SwitchButton';

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
            matchMedia: q => window.matchMedia(q),

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

    .appereance {

        .input {
            @include flex(row, center, space-between);
        }
    }

</style>
