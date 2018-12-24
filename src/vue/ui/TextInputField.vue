<template>
    <div class="text-input-field">

        <!-- Placeholder, will be moved if input contains text -->
        <span :class="{placeholder: 1, moved: value || focused}">{{ placeholder }}</span>

        <div class="field">
            <input ref="input"
                   :autofocus="autofocus ? 'autofocus' : ''"
                   :class="{empty: !value}"
                   :type="password ? 'password' : 'text'"
                   v-model="value"
                   spellcheck="false"
                   @blur="focused = false"
                   @focus="focused = true"
                   @input="$emit('update', value)"
                   @keyup.enter="$emit('submit')">

            <!-- Clear input -->
            <i :class="{'fas fa-fw fa-times': 1, visible: value}"
               @click="value = ''"></i>
        </div>

        <!-- Colored border to show focus -->
        <span :class="{border: 1, active: focused}"></span>

    </div>
</template>

<script>

    export default {
        props: {
            placeholder: {type: String, required: true},
            password: {type: Boolean, default: false},
            autofocus: {type: Boolean, default: false}
        },

        data() {
            return {
                value: '',
                focused: false
            };
        },

        methods: {

            clear() {
                this.value = '';
            }
        }
    };

</script>

<style lang="scss" scoped>


    .text-input-field {
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
        opacity: 0.75;

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

        &.active::after {
            width: 100%;
            background: $palette-deep-purple;
        }
    }

    .placeholder {
        position: absolute;
        color: $palette-decent-blue;
        transition: all 0.3s;
        @include font(400, 0.8em);

        &.moved {
            transform: translateY(-120%) scale(0.85);
            transform-origin: left;
            opacity: 0.9;
        }
    }

    .field {
        @include flex(row, center);
        width: 100%;

        input {
            @include font(400, 0.85em);
            padding: 0.75em 0;
            width: 100%;
            z-index: 2;
        }

        i {
            font-size: 0.8em;
            color: $palette-decent-blue;
            cursor: pointer;
            pointer-events: none;
            opacity: 0;
            transform: rotate(180deg);
            transition: all 0.3s;

            &:hover {
                color: $palette-tomatoe-red;
            }

            &.visible {
                opacity: 1;
                transform: none;
                pointer-events: all;
            }
        }
    }

</style>
