<template>
    <div class="color-picker">

        <!-- Palette to define saturation and value -->
        <div ref="paletteArea" class="color">
            <div ref="paletteAreaKnob" class="knob"></div>
        </div>

        <!-- Slider to define hue -->
        <div ref="hueArea" class="hue">
            <div ref="hueAreaKnob" class="knob"></div>
        </div>

        <div class="result">

            <!-- Color as hex value, can be changed by the user -->
            <input v-strict-focus
                   ref="resultInput"
                   :value="hexColor"
                   spellcheck="false"
                   type="text"
                   @blur="inputActive = false"
                   @focus="inputActive = true"
                   @keyup="updatePalette($event)">

            <!-- Used to accept a color -->
            <button @click="$emit('change', hexColor)">Save!</button>
        </div>

    </div>
</template>

<script>

    // Helper
    import Moveable from '../../js/Moveable';

    export default {

        data() {
            return {
                hexColor: '',
                color: {
                    h: 0,
                    s: 0,
                    l: 0
                },

                inputActive: false,
                paletteMoveable: null,
                hueMoveable: null
            };
        },

        mounted() {
            const {paletteArea, paletteAreaKnob, hueArea, hueAreaKnob} = this.$refs;
            const that = this;

            this.paletteMoveable = Moveable({
                element: paletteAreaKnob,
                wrapper: paletteArea,

                onchange(x, y) {

                    // Recalc only if the user isn't typing something
                    if (!that.inputActive) {

                        // Calculate saturation based on the position
                        const s = x / this.wrapper.offsetWidth;

                        // Calculate the value
                        const v = 1 - y / this.wrapper.offsetHeight;

                        that.color = hsvToHsl(that.color.h, s, v);
                        that.updateColors();
                    }
                }
            });

            this.hueMoveable = Moveable({
                element: hueAreaKnob,
                wrapper: hueArea,
                lockY: true,

                onchange(x) {
                    if (!that.inputActive) {
                        const h = x / this.wrapper.offsetWidth;
                        that.color = hsvToHsl(h, that.color.s, that.color.l);
                        that.paletteMoveable.trigger();
                        that.updateColors();
                    }
                }
            });

            // Initialize
            this.paletteMoveable.trigger();
        },

        methods: {

            updateColors() {

                // Update palette background
                this.$refs.paletteArea.style.background = `
                    linear-gradient(to top, black, transparent),
                    linear-gradient(to left, hsl(${this.color.h * 360}, 100%, 50%), rgb(255, 255, 255))
                `;

                // Upate palette-knob background
                this.$refs.paletteAreaKnob.style.background = this.hexColor;

                // Update output
                !this.inputActive && (this.hexColor = hslToHex(this.color));
            },

            updatePalette(e) {
                let value = e.target.value.toUpperCase();

                // Check if color is valid
                if (/^#([\dA-F]{3}|[\dA-F]{6})$/.test(value)) {
                    this.hexColor = value;
                    value = value.substring(1);

                    // Transform 3-digit hex to 6 digit
                    if (value.length === 3) {
                        value = [...value].map(v => v + v).join('');
                    }

                    // Convert to hsv
                    const {h, s, v} = hexToHsv(value);

                    // Set new positions
                    const hue = this.hueMoveable;
                    const hueX = hue.options.wrapper.offsetWidth * h;
                    hue.update(hueX, 0);

                    const palette = this.paletteMoveable;
                    const paletteX = palette.options.wrapper.offsetWidth * s;
                    const paletteY = palette.options.wrapper.offsetHeight * (1 - v);
                    palette.update(paletteX, paletteY);

                    this.color = hsvToHsl(h, s, v);
                    this.updateColors();
                }
            }

        }
    };

    function hsvToHsl(h, s, v) {
        let l = (2 - s) * v / 2;

        if (l !== 0) {
            if (l === 1) {
                s = 0;
            } else if (l < 0.5) {
                s = s * v / (l * 2);
            } else {
                s = s * v / (2 - l * 2);
            }
        }

        return {h, s, l};
    }

    function hslToHex({h, s, l}) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        const toHex = n => Math.round(n * 255).toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    function hexToHsv(hex) {
        const [r, g, b] = hex.match(/.{2}/g).map(v => parseInt(v, 16) / 255);

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, v = max;

        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0; // achromatic
        } else {
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return {h, s, v};
    }

</script>

<style lang="scss" scoped>

    .color-picker {
        @include flex(column);
        background: white;
    }

    .color {
        @include size(100%, 8em);
        background: red;

        .knob {
            @include size(12px);
            border: 2px solid white;
            border-radius: 100%;
        }
    }

    .hue {
        @include size(100%, 8px);
        background: linear-gradient(to right, hsl(0, 100%, 50%), hsl(60, 100%, 50%), hsl(120, 100%, 50%), hsl(180, 100%, 50%), hsl(240, 100%, 50%), hsl(300, 100%, 50%), hsl(360, 100%, 50%));
        margin: 0.5em 0 1em;

        .knob {
            @include size(6px, 14px);
            margin-top: -3px;
            border-radius: 50em;
        }
    }

    .color,
    .hue {
        position: relative;
        cursor: pointer;
        border-radius: 0.15em;

        .knob {
            position: absolute;
            background: white;
            box-shadow: 0 1px 3px rgba(black, 0.2);
        }
    }

    .result {
        @include flex(row, stretch);
        width: 13em;

        input {
            @include font(600, 0.85em);
            background: $palette-snow-white;
            color: $palette-deep-blue;
            border: 1px solid transparent;
            padding: 0.25em 0.75em;
            text-transform: uppercase;
            border-radius: 0.15em;
            width: 0;
            flex-grow: 1;

            &:focus {
                border-color: darken($palette-snow-white, 5);
            }
        }

        button {
            margin-left: 0.75em;
            background: $palette-cloud-blue;
            transition: all 0.3s;
            cursor: pointer;
            border-radius: 0.15em;
            color: white;
            font-weight: 600;
            padding: 0 0.75em;

            &:hover {
                filter: brightness(1.1);
            }
        }
    }

</style>
