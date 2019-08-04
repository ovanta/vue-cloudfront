<template>
    <popup title="Share"
           store-prop="ShareViaLink"
           class="share-via-link">

        <h3 v-if="share.node">Everyone with the link can download  <b>{{ share.node.name }}</b></h3>

        <svg xmlns="http://www.w3.org/2000/svg"
             viewBox="0 0 80 80">
            <path
                d="M 60.046875 7.015625 C 56.730469 7.003906 53.40625 8.25 50.871094 10.75 L 41.808594 19.808594 C 37.992188 23.625 37.050781 29.242188 38.980469 33.949219 L 40.546875 32.386719 C 39.320313 28.578125 40.210938 24.230469 43.242188 21.203125 L 52.277344 12.171875 C 54.414063 10.066406 57.207031 9.015625 60.003906 9.015625 C 62.824219 9.015625 65.640625 10.085938 67.777344 12.222656 C 72.035156 16.480469 72.058594 23.433594 67.828125 27.71875 L 58.777344 36.78125 C 55.761719 39.792969 51.421875 40.679688 47.613281 39.453125 L 46.050781 41.019531 C 47.632813 41.667969 49.316406 41.996094 51 41.996094 C 54.328125 41.996094 57.65625 40.726563 60.191406 38.191406 L 69.25 29.125 C 74.25 24.058594 74.222656 15.839844 69.191406 10.808594 C 66.675781 8.292969 63.363281 7.027344 60.046875 7.015625 Z M 67 22 C 66.449219 22 66 22.449219 66 23 C 66 23.550781 66.449219 24 67 24 C 67.550781 24 68 23.550781 68 23 C 68 22.449219 67.550781 22 67 22 Z M 64 25 C 63.449219 25 63 25.449219 63 26 C 63 26.550781 63.449219 27 64 27 C 64.550781 27 65 26.550781 65 26 C 65 25.449219 64.550781 25 64 25 Z M 53 26 C 52.449219 26 52 26.449219 52 27 C 52 27.550781 52.449219 28 53 28 C 53.550781 28 54 27.550781 54 27 C 54 26.449219 53.550781 26 53 26 Z M 61 28 C 60.449219 28 60 28.449219 60 29 C 60 29.550781 60.449219 30 61 30 C 61.550781 30 62 29.550781 62 29 C 62 28.449219 61.550781 28 61 28 Z M 50 29 C 49.449219 29 49 29.449219 49 30 C 49 30.550781 49.449219 31 50 31 C 50.550781 31 51 30.550781 51 30 C 51 29.449219 50.550781 29 50 29 Z M 58 31 C 57.449219 31 57 31.449219 57 32 C 57 32.550781 57.449219 33 58 33 C 58.550781 33 59 32.550781 59 32 C 59 31.449219 58.550781 31 58 31 Z M 46.980469 31.988281 C 46.71875 31.996094 46.472656 32.105469 46.292969 32.292969 L 32.292969 46.292969 C 32.03125 46.542969 31.925781 46.917969 32.019531 47.265625 C 32.109375 47.617188 32.382813 47.890625 32.734375 47.980469 C 33.082031 48.074219 33.457031 47.96875 33.707031 47.707031 L 47.707031 33.707031 C 48.003906 33.417969 48.089844 32.980469 47.929688 32.601563 C 47.769531 32.21875 47.394531 31.976563 46.980469 31.988281 Z M 55 34 C 54.449219 34 54 34.449219 54 35 C 54 35.550781 54.449219 36 55 36 C 55.550781 36 56 35.550781 56 35 C 56 34.449219 55.550781 34 55 34 Z M 28.996094 38.015625 C 25.664063 38.015625 22.335938 39.28125 19.800781 41.816406 L 10.738281 50.882813 C 5.742188 55.953125 5.769531 64.167969 10.800781 69.203125 C 15.832031 74.234375 24.050781 74.261719 29.125 69.257813 L 38.1875 60.203125 C 42 56.386719 42.941406 50.769531 41.011719 46.0625 L 39.449219 47.625 C 40.671875 51.433594 39.78125 55.777344 36.75 58.808594 L 27.714844 67.839844 C 25.578125 69.945313 22.785156 70.996094 19.988281 70.996094 C 17.171875 70.996094 14.351563 69.925781 12.214844 67.785156 C 7.957031 63.527344 7.933594 56.578125 12.160156 52.289063 L 21.214844 43.230469 C 24.230469 40.214844 28.570313 39.332031 32.375 40.554688 L 33.941406 38.988281 C 32.359375 38.34375 30.675781 38.015625 28.996094 38.015625 Z M 30 49 C 29.449219 49 29 49.449219 29 50 C 29 50.550781 29.449219 51 30 51 C 30.550781 51 31 50.550781 31 50 C 31 49.449219 30.550781 49 30 49 Z M 27 52 C 26.449219 52 26 52.449219 26 53 C 26 53.550781 26.449219 54 27 54 C 27.550781 54 28 53.550781 28 53 C 28 52.449219 27.550781 52 27 52 Z M 36 54 C 35.449219 54 35 54.449219 35 55 C 35 55.550781 35.449219 56 36 56 C 36.550781 56 37 55.550781 37 55 C 37 54.449219 36.550781 54 36 54 Z M 33 57 C 32.449219 57 32 57.449219 32 58 C 32 58.550781 32.449219 59 33 59 C 33.550781 59 34 58.550781 34 58 C 34 57.449219 33.550781 57 33 57 Z M 30 60 C 29.449219 60 29 60.449219 29 61 C 29 61.550781 29.449219 62 30 62 C 30.550781 62 31 61.550781 31 61 C 31 60.449219 30.550781 60 30 60 Z M 27 63 C 26.449219 63 26 63.449219 26 64 C 26 64.550781 26.449219 65 27 65 C 27.550781 65 28 64.550781 28 64 C 28 63.449219 27.550781 63 27 63 Z M 24 66 C 23.449219 66 23 66.449219 23 67 C 23 67.550781 23.449219 68 24 68 C 24.550781 68 25 67.550781 25 67 C 25 66.449219 24.550781 66 24 66 Z "></path>
        </svg>

        <div class="actions">
            <button class="copy" @click="copy">
                <flow-up-text ref="copyFlowText" text="copied"/>
                Copy
            </button>

            <button class="revoke" @click="revoke">
                <flow-up-text ref="revokeFlowText" text="revoked"/>
                Revoke
            </button>
        </div>

    </popup>
</template>

<script>

    // Components
    import Popup          from './Popup';
    import TextInputField from '../../../ui/input/TextInputField';
    import FlowUpText     from '../../../ui/specific/FlowUpText';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {Popup, TextInputField, FlowUpText},

        data() {
            return {};
        },

        computed: {
            ...mapState(['share'])
        },

        watch: {
            'share.node'(val) {
                if (!val.staticIds.length) {
                    this.requestId();
                }
            }
        },

        methods: {

            async requestId() {
                return this.$store.dispatch('nodes/addStaticId', {node: this.share.node});
            },

            async removeAll() {
                return this.$store.dispatch('nodes/removeStaticIds', {ids: this.share.node.staticIds});
            },

            copy() {
                const url = this.$utils.createDownloadUrl(this.share.node.staticIds[0]);
                navigator.clipboard.writeText(url)
                    .then(() => this.$refs.copyFlowText.show());
            },

            revoke() {
                this.$store.commit('dialogbox/show', {
                    type: 'info',
                    title: 'Are you sure?',
                    text: 'All previous links will be invalidated.',
                    buttons: [
                        {type: 'cancel', text: 'Cancel'},
                        {type: 'accept', text: 'Okay'}
                    ],
                    onResolve: async index => {
                        if (index) {
                            await this.removeAll();
                            await this.requestId();
                            this.$refs.revokeFlowText.show()
                        }
                    }
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .share-via-link {
        height: 100%;

        h3 {
            @include font(400, 0.85em);
            color: RGB(var(--primary-text-color));
        }

        svg {
            @include size(7.5em);
            display: flex;
            fill: RGB(var(--primary-text-color));
            margin: 1.5em auto;
        }
    }

    .actions {
        @include flex(row, center, center);

        button {
            @include font(400, 0.85em);
            color: RGB(var(--teritary-text-color));
            padding: 0.65em 0;
            border-radius: 0.15em;
            transition: all 0.3s;
            margin-left: 0.5em;
            text-transform: uppercase;
            position: relative;
            flex-grow: 1;

            &:hover {
                filter: brightness(1.05);
            }
        }

        .copy {
            background: RGB(var(--static-success-color));
        }

        .revoke {
            background: RGB(var(--static-error-color));
        }
    }

    @include mq-phones {
        .exising-links {
            padding: 0 0.5em;
        }
    }

</style>
