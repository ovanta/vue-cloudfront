<template>
    <overlay :open="dialogbox.open" class="dialog-box">

        <div class="content">

            <div class="header">
                <i class="fas fa-fw fa-question-circle"></i>
                <h1> {{ dialogbox.title }}</h1>
            </div>

            <p v-if="dialogbox.text">{{ dialogbox.text }}</p>

            <div class="actions">
                <button v-for="(btn, index) of dialogbox.buttons"
                        :class="btn.type"
                        @click="close(index)">{{ btn.text }}
                </button>
            </div>
        </div>

    </overlay>
</template>

<script>

    // Vuex stuff
    import {mapState} from 'vuex';

    // Components
    import Overlay from './Overlay';

    export default {
        components: {Overlay},

        data() {
            return {};
        },

        computed: {
            ...mapState(['dialogbox'])
        },

        methods: {

            close(index) {
                this.dialogbox.close(index);
            }
        }
    };

</script>

<style lang="scss" scoped>

    $buttons: (
        (class: 'accept', color: $palette-cloud-blue),
        (class: 'cancel', color: $palette-tomatoe-red)
    );

    .dialog-box {
        position: absolute;
        @include position(0, 0, 0, 0);
        @include flex(column, center, center);
        background: rgba($palette-asphalt, 0.125);
        opacity: 0;
        transition: all 0.3s;
        pointer-events: none;
        z-index: 1000;

        &.open {
            opacity: 1;
            pointer-events: all;

            .content {
                @include animate('0.35s ease forwards') {
                    25% {
                        transform: translateY(-0.5em) scale(0.95);
                        opacity: 0.5;
                    }
                    50% {
                        transform: scale(1.025);
                        opacity: 1;
                    }
                    100% {
                        transform: none;
                        opacity: 1;
                    }
                }
            }
        }
    }

    .content {
        @include width(50vw, 5em, 25em);
        background: $palette-snow-white;
        color: $palette-asphalt;
        padding: 0.75em 1.25em;
        border-radius: 0.15em;
        box-shadow: 0 0.4em 1.5em rgba($palette-asphalt, 0.075);
        opacity: 0;
        transform-origin: top center;
        transform: translateY(-0.5em) scale(0.95);
        transition: all 0.15s;

        .header {
            @include flex(row, center);

            h1 {
                @include font(600, 1.05em);
            }

            i {
                font-size: 0.95em;
                margin-right: 0.5em;
            }
        }

        p {
            @include font(500, 0.96em);
            margin: 1.25em 0;
            line-height: 1.5em;
        }

        .actions {
            @include flex(row, center, flex-end);
            font-size: 0.95em;

            button {
                @include font(600, 0.85em);
                margin-left: 1.25em;
                text-transform: capitalize;
                padding: 0.55em 1.25em 0.6em;
                border-radius: 0.15em;
                color: white;
                transition: all 0.3s;

                @each $type in $buttons {
                    $class-extension: map-get($type, 'class');
                    $color: map-get($type, 'color');

                    &.#{$class-extension} {
                        background: $color;
                        box-shadow: 0 0.05em 0.3em rgba($color, 0.5);
                        border: 2px solid $color;

                        &:hover {
                            box-shadow: 0 0.05em 0.75em rgba($color, 0.75);
                        }

                        @if (lightness($color) > 75) {
                            color: $palette-asphalt;
                        } @else {
                            color: $palette-snow-white;
                        }
                    }
                }
            }
        }
    }

    @include mobile {
        .content {
            max-width: 90vw;
            width: 90vw;
        }
    }

</style>
