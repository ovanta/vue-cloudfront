<template>
    <section :class="{popup: 1, open: $store.state.activePopup === storeProp}">

        <div class="container">

            <!-- Header with title and close button -->
            <div class="header">
                <span class="title">{{ title }}</span>
                <i class="fas fa-fw fa-times" @click="$store.commit('setActivePopup', null)"></i>
            </div>

            <!-- Contains content of popovers page -->
            <slot></slot>
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
        transform: translateY(-1em);
        transition: all 0.3s;
        background: rgba($palette-deep-blue, 0.05);
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
        border-radius: 0.15em;
        max-height: 100%;
        max-width: 52em;

        .header {
            @include flex(row);
            margin-bottom: 1em;

            .title {
                color: $palette-deep-blue;
                font-weight: 600;
            }

            i {
                margin-left: auto;
                padding: 0 0 0.5em 1.5em;
                color: $palette-decent-blue;
                transition: all 0.3s;
                cursor: pointer;

                &:hover {
                    color: $palette-tomatoe-red;
                }
            }
        }
    }

    @include notebook {
        .popup {
            padding: 1em;
        }
    }

</style>
