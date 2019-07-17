<template>
    <popup v-if="share.node"
           title="Create public download links"
           store-prop="ShareViaLink"
           class="share-via-link">

        <h3>Everyone with on of these links can download <b>{{ share.node.name }}</b></h3>

        <!-- List of exising links -->
        <div class="exising-links">

            <div v-for="id of share.node.staticIds"
                 :key="id"
                 class="link">
                <span class="link" @contextmenu.stop="">{{ apiEndPoint }}/d/{{ id }}</span>
                <span class="delete" @click="removeId(id)">Delete</span>
            </div>

            <div v-if="!share.node.staticIds.length" class="placeholder">
                <p>There are currently no download links attached...</p>
            </div>

        </div>

        <div class="actions">
            <button class="remove-all" @click="removeAll">Remove all</button>
            <button class="add" @click="requestId">Add link</button>
        </div>

    </popup>
</template>

<script>

    // Components
    import Popup          from './Popup';
    import TextInputField from '../../../ui/input/TextInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {Popup, TextInputField},

        data() {
            return {};
        },

        computed: {
            ...mapState(['share']),

            apiEndPoint() {
                const {apiEndPoint} = this.$config;
                return apiEndPoint.startsWith('http') ? apiEndPoint : location.origin + apiEndPoint;
            }
        },

        methods: {

            requestId() {
                this.$store.dispatch('nodes/addStaticId', {node: this.share.node});
            },

            removeId(id) {
                this.$store.dispatch('nodes/removeStaticIds', {ids: [id]});
            },

            removeAll() {
                this.$store.dispatch('nodes/removeStaticIds', {ids: this.share.node.staticIds});
            }
        }
    };

</script>

<style lang="scss" scoped>

    .share-via-link {
        @include flex(column);
        height: 100%;

        h3 {
            @include font(400, 0.85em);
            color: RGB(var(--primary-text-color));
        }
    }

    .exising-links {
        @include flex(column);
        margin: 1.25em 0;
        max-height: 15em;
        overflow: auto;
        color: RGB(var(--primary-text-color));

        .link {
            @include flex(row, center);
            margin: 0.25em 0;
            flex-shrink: 0;

            .link {
                @include font(500, 0.8em);
                user-select: all;
                cursor: pointer;
                flex-grow: 1;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .delete {
                background: RGB(var(--static-error-color));
                @include font(600, 0.75em);
                padding: 0.35em 0.5em;
                color: RGB(var(--teritary-text-color));
                border-radius: 0.15em;
                margin-left: 0.75em;
                transition: all 0.3s;
                cursor: pointer;
                text-transform: uppercase;

                &:hover {
                    filter: brightness(0.95);
                }
            }
        }

        .placeholder {
            text-align: center;
            margin: 1em 0;
            @include font(400, 0.85em);
            color: RGB(var(--primary-text-color));
        }
    }

    .actions {
        @include flex(row, center, flex-end);

        button {
            @include font(400, 0.85em);
            color: RGB(var(--teritary-text-color));
            padding: 0.5em 1em;
            border-radius: 0.15em;
            transition: all 0.3s;
            margin-left: 0.5em;
        }

        .add {
            background: RGB(var(--theme-primary));

            &:hover {
                filter: brightness(0.9);
            }
        }

        .remove-all {
            background: RGB(var(--static-error-color));

            &:hover {
                filter: brightness(0.9);
            }
        }
    }

    @include mq-phones {
        .exising-links {
            padding: 0 0.5em;
        }
    }

</style>
