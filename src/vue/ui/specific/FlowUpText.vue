<template>
    <div :class="{'flow-up-text': 1, active}">
        {{ text }}
    </div>
</template>

<script>

    export default {
        props: {
            text: {type: String, required: true}
        },

        data() {
            return {
                active: false,
                timeout: null
            };
        },

        methods: {

            show() {
                this.active = false;

                requestAnimationFrame(() => {
                    this.active = true;

                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        this.active = false;
                        this.timeout = null;
                    }, 1000);
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .flow-up-text {
        @include font(600, 0.95em);
        position: absolute;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        background: RGB(var(--secondary-background-color));
        color: RGB(var(--primary-text-color));
        text-transform: lowercase;
        padding: 0.2em 0.5em 0.3em;
        border-radius: 0.15em;
        opacity: 0;

        &.active {
            @include animate('1s') {
                0% {
                    opacity: 0;
                }
                50% {
                    opacity: 0.75;
                    transform: translate(-50%, -1.75em);
                }
                100% {
                    transform: translate(-50%, -2.25em);
                    opacity: 0;
                }
            }
        }
    }

</style>
