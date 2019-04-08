<template>
    <section :class="{popup: 1, open}">

        <div ref="popupContent" class="container">

            <!-- Header with title and close button -->
            <div class="header">
                <span class="title">{{ title }}</span>
                <i class="fas fa-fw fa-times" @click="close"></i>
            </div>

            <!-- Contains content of popovers page -->
            <div class="content">
                <slot></slot>
            </div>
        </div>

    </section>
</template>

<script>

    export default {

        props: {

            /**
             * Contains a key, referencing to a boolsche value
             * if this page is currently open.
             */
            storeProp: {
                type: String,
                required: true
            },

            // Help page title
            title: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                outOfBoundsClickArgs: []
            };
        },

        computed: {

            open() {
                return this.$store.state.activePopup === this.storeProp;
            }
        },

        watch: {

            open(open) {
                const {popupContent} = this.$refs;

                // Unbind previous listener
                if (this.outOfBoundsClickArgs.length) {
                    this.utils.off(...this.outOfBoundsClickArgs);
                }

                if (open) {

                    // Detect clicks outside of content container
                    this.outOfBoundsClickArgs = this.utils.on(window, 'click', e => {

                        // Check if user clicked outside of it
                        if (!this.utils.eventPath(e).includes(popupContent)) {
                            this.close();
                        }
                    }, {useCapture: false});
                }
            }
        },

        methods: {
            close() {
                this.$store.commit('setActivePopup', null);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .popup {
        position: absolute;
        @include position(0, 0, 0, 0);
        @include flex(row, center, center);
        pointer-events: none;
        opacity: 0;
        transform: translateY(-1em) rotateX(10deg);
        transition: all 0.3s;
        background: rgba($palette-sick-white, 0.5);
        z-index: 10;

        &.open {
            pointer-events: all;
            transform: none;
            opacity: 1;
        }
    }

    .container {
        @include flex(column);
        background: white;
        box-shadow: 0 8px 25px 0 rgba(black, 0.08), 0 0 5px 0 rgba(black, 0.02);
        padding: 1.25em 2em 2em;
        border-radius: 0.25em;
        max-height: 100%;
        max-width: 52em;

        .content {
            overflow: auto;
        }

        .header {
            @include flex(row);
            margin-bottom: 1em;

            .title {
                color: $palette-asphalt;
                font-weight: 600;
            }

            i {
                margin-left: auto;
                padding: 0 0 0.5em 1.5em;
                color: $palette-decent-blue;
                transition: all 0.3s;
                cursor: pointer;
                font-size: 0.95em;

                &:hover {
                    color: $palette-asphalt;
                }
            }
        }
    }

    @include MQTablets {
        .popup {
            padding: 1em;
        }
    }

    @include MQPhones {
        .popup {
            padding: 0.25em;
        }

        .container {
            padding: 1em 1.5em;
        }
    }

</style>
