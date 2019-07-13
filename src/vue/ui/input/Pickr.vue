<template>
    <div ref="pickr">
        <slot></slot>
    </div>
</template>

<script>

    // Components
    import '@simonwep/pickr/dist/themes/nano.min.css';
    import Pickr from '@simonwep/pickr/dist/pickr.min';

    export default {

        props: {
            color: {type: String, default: '#7c6ded'}
        },

        data() {
            return {
                pickr: null,
                closeArgs: []
            };
        },

        watch: {
            color(newVal) {
                this.pickr && this.pickr.setColor(newVal, true);
            }
        },

        mounted() {
            this.pickr = new Pickr({
                el: this.$refs.pickr,
                position: 'right-middle',
                useAsButton: true,
                theme: 'nano',

                swatches: this.$config.predefinedColors,
                components: {

                    // Main components
                    preview: true,
                    hue: true,
                    lockOpacity: true,

                    // Input / output Options
                    interaction: {
                        input: true,
                        hex: true,
                        save: true
                    }
                }
            }).on('save', color => {
                this.$emit('save', color.toHEXA().toString());
            });

            const {app} = this.pickr.getRoot();

            // Move pickr-app to css-variablen scope
            app.remove();
            document.getElementById('app').appendChild(app);

            // Prevent any action through the model
            this.$utils.on(app, ['keydown', 'scroll', 'mousedown', 'touchstart'], e => {
                e.stopImmediatePropagation();
                e.stopPropagation();
            });
        },

        destroyed() {
            this.pickr && this.pickr.destroy();
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
        background: RGB(var(--primary-background-color));

        .pcr-selection {
            grid-template-rows: 5fr auto;

            .pcr-color-preview {
                grid-area: 2/1/3/1;
            }
        }
    }

</style>
