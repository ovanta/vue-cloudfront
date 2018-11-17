<template>
    <div class="color-chooser">

        <!-- Some material colors as grid -->
        <div class="pre-defined">
            <div v-for="color of colors"
                 :style="{background: color}"
                 class="color"
                 @click="$emit('change', color)"></div>
        </div>

        <div class="divider"></div>

        <!-- Define own color -->
        <div class="new-color">
            <div :style="{background: '#' + customColor}"
                 class="preview"
                 @click="emitCustomColor"></div>

            <input v-model="customColor"
                   type="text"
                   spellcheck="false"
                   @keydown="customKeyDown"
                   @keydown.enter="emitCustomColor">
        </div>

    </div>
</template>

<script>

    export default {

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
                    '#BDBDBD',
                    '#78909C',
                    '#454d50'
                ],

                customColor: 'EC407A'
            };
        },

        methods: {

            customKeyDown(e) {

                // Dont allow other keys than 0-9 and a-f
                if (!/[\dA-Fa-f]/.test(e.key)) {
                    e.preventDefault();
                }
            },

            emitCustomColor() {

                // Transform to uppercase and validate
                this.customColor = this.customColor.toUpperCase();
                if (/^([\dA-F]{3}|[\dA-F]{6})$/.test(this.customColor)) {

                    // Transform 3-digit hex to 6 digit
                    if (this.customColor.length === 3) {
                        this.customColor = [...this.customColor].map(v => v + v).join('');
                    }

                    // Trigger update
                    this.$emit('change', '#' + this.customColor);
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .color-chooser {
        @include flex(column);
    }

    .pre-defined {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 5px;

        .color {
            @include size(20px);
            border: 1px solid rgba(black, 0.1);
            border-radius: 100%;
            cursor: pointer;
            transition: all 1s;

            &:hover {
                filter: brightness(1.2);
            }
        }
    }

    .divider {
        @include size(100%, 1px);
        background: $palette-snow-white;
        margin: 0.75em 0;
    }

    .new-color {
        @include flex(row, center);
        height: 24px;
        border-radius: 50em;
        background: $palette-snow-white;

        .preview {
            @include size(24px);
            cursor: pointer;
            border-radius: 100%;
            border: 2px solid $palette-snow-white;
        }

        input {
            flex-grow: 1;
            color: $palette-deep-blue;
            @include font(600, 0.9em);
            text-transform: uppercase;
            margin-left: 0.5em;
            width: 0;
        }
    }

</style>
