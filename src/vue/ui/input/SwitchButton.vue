<template>
    <div :class="{'switch-button': 1, active: value}" @click="$emit('input', !value)"></div>
</template>

<script>

    export default {
        props: {
            value: {type: Boolean, default: false}
        },

        data() {
            return {};
        }
    };

</script>

<style lang="scss" scoped>

    .switch-button {
        @include size(24px, 42px);
        position: relative;
        border-radius: 50em;
        background: $palette-blurry-gray;
        transition: all 0.3s;
        cursor: pointer;

        &::before {
            @include pseudo();
            @include size(18px);
            border-radius: 50em;
            background: white;
            margin: 3px;

            @include animate('0.25s ease-in-out reverse forwards') {
                0% {
                    width: 18px;
                }
                50% {
                    width: calc(100% - 6px);
                }
                100% {
                    right: 0;
                    width: 18px;
                }
            }
        }

        &.active {
            background: $palette-theme-secondary;

            &::before {
                @include animate('0.25s ease-in-out forwards') {
                    0% {
                        width: 18px;
                    }
                    50% {
                        width: calc(100% - 6px);
                    }
                    100% {
                        right: 0;
                        width: 18px;
                    }
                }
            }
        }
    }

</style>
