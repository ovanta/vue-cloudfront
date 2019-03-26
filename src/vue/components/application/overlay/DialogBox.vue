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

    .dialog-box {
        position: fixed;
        @include position(0, 0, 0, 0);
        @include flex(column, center, center);
        background: rgba($palette-deep-blue, 0.05);
        opacity: 0;
        transition: all 0.3s;
        pointer-events: none;
        z-index: 1000;

        &.open {
            opacity: 1;
            pointer-events: all;

            .content {
                opacity: 1;
                transform: none;
            }
        }
    }

    .content {
        @include width(50vw, 5em, 25em);
        background: $palette-snow-white;
        color: $palette-deep-blue;
        padding: 0.75em 1.25em;
        border-radius: 0.15em;
        box-shadow: 0 0.4em 1.5em rgba($palette-deep-blue, 0.075);
        opacity: 0;
        transform-origin: top center;
        transform: translateY(-0.5em) scale(0.95);
        transition: all 0.15s;

        .header {
            @include flex(row, center);

            h1 {
                @include font(500, 1.075em);
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
                @include font(500, 0.85em);
                margin-left: 1.25em;
                text-transform: capitalize;
                padding: 0.55em 1.25em 0.6em;
                border-radius: 0.15em;
                color: white;
                box-shadow: 0 0.05em 0.15em rgba($palette-deep-blue, 0.1);
                transition: all 0.3s;

                &.primary {
                    background: $palette-theme-primary;
                    border: 2px solid $palette-theme-primary;

                    &:hover {
                        filter: brightness(1.15);
                    }
                }

                &.secondary {
                    border: 2px solid $palette-theme-secondary;
                    color: $palette-theme-secondary;
                    font-weight: 600;

                    &:hover {
                        background: $palette-theme-secondary;
                        color: white;
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
