<template>
    <div class="con">

        <div class="field">
            <input ref="input"
                   :type="password ? 'password' : 'text'"
                   :class="{empty: !value}"
                   v-model="value"
                   :autofocus="autofocus"
                   spellcheck="false"
                   @focus="focused = true"
                   @blur="focused = false"
                   @input="updateValue"
                   @keyup.enter="$emit('submit')">

            <!-- Clear input -->
            <i v-if="value"
               class="fas fa-fw fa-times"
               @click="value = ''"></i>
        </div>

        <!-- Placeholder, will be moved if input contains text -->
        <span :class="{placeholder: 1, error, moved: value}">{{ placeholder }}</span>

        <!-- Colored border to show focus -->
        <span :class="{border: 1, error, active: focused}"></span>

    </div>
</template>

<script>

    export default {
        props: {
            placeholder: {type: String, required: true},
            password: {type: Boolean, default: false},
            autofocus: {type: Boolean, default: false},
            validate: {
                type: [RegExp, Function], default: () => /.*/
            }
        },

        data() {
            return {
                value: '',
                focused: false,
                error: false
            };
        },

        methods: {
            updateValue() {
                const {validate, value} = this;

                // Emit event
                this.$emit('update', value, this.error);

                // Validate
                this.error =
                    (typeof validate === 'function' && !validate(value)) ||
                    (validate instanceof RegExp && !validate.test(value));

                // If value is empty dont show an error
                if (!value) {
                    this.error = false;
                }
            }
        }
    };

</script>

<style lang="scss" scoped>


    .con {
        position: relative;
        @include inline-flex(row, center);
        border-radius: 0.15em;
        transition: all 0.3s;
        padding-top: 0.5em;
    }

    .border {
        position: absolute;
        @include position(auto, 0, 0, 0);
        @include size(100%, 1px);

        &::before,
        &::after {
            @include pseudo();
            @include size(100%, 1px);
            background: $palette-decent-blue;
        }

        &::after {
            width: 0;
            transition: all 0.3s ease-in-out;
        }

        &.error::after {
            background: $palette-tomatoe-red;
        }

        &.active::after {
            width: 100%;
            background: $palette-deep-purple;
        }
    }

    .placeholder {
        position: absolute;
        color: $palette-decent-blue;
        transition: all 0.3s;
        z-index: -1;

        &.error {
            color: $palette-tomatoe-red;
        }

        &.moved {
            transform: translateY(-95%) scale(0.75);
            transform-origin: left;
            opacity: 0.9;
        }
    }

    .placeholder,
    .field input {
        @include font(400, 0.9em);
    }

    .field {
        @include flex(row, center);
        width: 100%;

        input {
            padding: 0.75em 0;
            width: 100%;
        }

        i {
            font-size: 0.8em;
            color: $palette-decent-blue;
            transition: all 0.3s;
            cursor: pointer;

            &:hover {
                color: $palette-tomatoe-red;
            }

            @include animate('0.5s ease-in-out') {
                from {
                    opacity: 0;
                    transform: rotate(180deg);
                }
                to {
                    opacity: 1;
                    transform: none;
                }
            }
        }
    }

</style>
