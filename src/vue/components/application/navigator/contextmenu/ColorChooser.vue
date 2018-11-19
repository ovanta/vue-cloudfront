<template>
    <div class="color-chooser">

        <!-- Define own color -->
        <color-picker class="color-picker" @change="customColor"></color-picker>

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

    // Components
    import ColorPicker from '../../../../ui/ColorPicker';

    export default {

        components: {
            ColorPicker
        },

        data() {
            return {
                colors: [
                    '#EF5350',
                    '#EC407A',
                    '#AB47BC',
                    '#7E57C2',
                    '#5C6BC0',
                    '#42A5F5',
                    '#29B6F6',
                    '#26C6DA',
                    '#26A69A',
                    '#66BB6A',
                    '#9CCC65',
                    '#D4E157',
                    '#FFEE58',
                    '#FFCA28',
                    '#FFA726',
                    '#FF7043',
                    '#8D6E63',
                    '#BDBDBD'
                ]
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
