<template>
    <div class="color-chooser">

        <!-- Define own color -->
        <color-picker class="color-picker" @change="customColor"/>

        <!-- Some material colors as grid -->
        <div class="pre-defined">
            <div v-for="color of colors"
                 :style="{background: color}"
                 class="color"
                 @click="$emit('change', color)"></div>
        </div>

    </div>
</template>

<script>

    // Config
    import config from '../../../../../../../config/config.json';

    // Components
    import ColorPicker from '../../../../../ui/ColorPicker';

    export default {

        components: {
            ColorPicker
        },

        data() {
            return {
                colors: config.colors
            };
        },

        methods: {

            customColor(color) {
                this.$emit('change', color);
            }

        }
    };

</script>

<style lang="scss" scoped>

    .color-chooser {
        @include flex(column, center);
    }

    .pre-defined {
        @include flex(row, space-between, space-around);
        flex-wrap: wrap;
        margin-top: 1em;

        .color {
            @include size(20px);
            border: 1px solid rgba(black, 0.1);
            border-radius: 100%;
            cursor: pointer;
            margin: 3px;
            transition: all 1s;

            &:hover {
                filter: brightness(1.2);
            }
        }
    }

</style>
