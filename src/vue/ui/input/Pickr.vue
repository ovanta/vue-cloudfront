<template>
    <div ref="pickr">
        <slot></slot>
    </div>
</template>

<script>

    // Components
    import '@simonwep/pickr/dist/themes/nano.min.css';
    import Pickr from '@simonwep/pickr';

    export default {

        props: {
            color: {type: String, default: '#7c6ded'},
            options: {type: Object, default: null}
        },

        data() {
            return {
                pickr: null,
                closeArgs: []
            };
        },

        watch: {
            color(newVal) {
                this.pickr && this.pickr.setColor(newVal);
            }
        },

        mounted() {
            this.pickr = new Pickr({
                el: this.$refs.pickr,
                lockOpacity: true,
                default: this.color,
                theme: 'nano',

                swatches: this.$config.predefinedColors,
                defaultRepresentation: 'HEXA',
                components: {

                    // Main components
                    preview: true,
                    hue: true,

                    // Input / output Options
                    interaction: {
                        input: true,
                        save: true
                    }
                },

                ...this.options
            }).on('save', color => {
                this.$emit('save', color.toHEXA().toString());
            });

            const {app} = this.pickr.getRoot();

            // Move pickr-app to css-variables scope
            app.remove();
            document.getElementById('app').appendChild(app);

            // Prevent any action through the model
            this.$utils.on(app, ['keydown', 'scroll', 'mousedown', 'touchstart'], e => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
        },

        destroyed() {
            this.pickr.destroyAndRemove();
        },

        methods: {

            hide() {
                this.pickr && this.pickr.hide();
            },

            customColor(color) {
                this.$emit('change', color);
            }
        }
    };

</script>

<style lang="scss">

    .pcr-app.pcr-app.pcr-app {
        width: 13.5em;
        background: RGB(var(--primary-background-color));

        .pcr-selection {
            grid-template-rows: 5fr auto;

            .pcr-color-preview {
                grid-area: 2/1/3/1;
            }
        }
    }

</style>
