<template>
    <div class="global">

        <div class="setting">
            <p>Use SI Prefix to display file-size</p>
            <switch-button :value="settings.user.siPrefix" @input="props.siPrefix = $event"/>
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
            return {
                props: {
                    ...this.$store.state.settings.user
                }
            };
        },

        computed: {
            ...mapState(['settings'])
        },

        watch: {
            props: {
                deep: true,
                handler(newVal) {
                    this.$store.dispatch('settings/change', state => {
                        Object.assign(state.user, newVal);
                        return state;
                    });
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .global {

        .setting {
            @include flex(row, center, space-between);

            p {
                @include font(600, 0.85em);
                color: $palette-asphalt;
                margin-right: 1em;
            }
        }
    }


</style>
