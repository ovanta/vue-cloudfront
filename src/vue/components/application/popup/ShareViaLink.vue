<template>
    <popup v-if="share.node"
           title="Create public download links"
           store-prop="ShareViaLink"
           class="share-via-link">

        <h3>Everyone with on of these links can download <b>{{ share.node.name }}</b></h3>

        <!-- List of exising links -->
        <div class="exising-links">

            <div v-for="id of share.node.staticIds" class="link">
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

    // Config
    import {apiEndPoint} from '../../../../../config/config.json';

    // Components
    import Popup          from './Popup';
    import TextInputField from '../../../ui/input/TextInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {Popup, TextInputField},

        data() {
            return {
                apiEndPoint: apiEndPoint.startsWith('http') ? apiEndPoint : location.origin + apiEndPoint
            };
        },

        computed: {
            ...mapState(['share'])
        },

        methods: {

            requestId() {
                this.$store.dispatch('nodes/addStaticId', {node: this.share.node});
            },

            removeId(id) {
                this.$store.dispatch('nodes/removeStaticId', {node: this.share.node, ids: [id]});
            },

            removeAll() {
                this.$store.dispatch('nodes/removeStaticId', {node: this.share.node, ids: this.share.node.staticIds});
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
            color: $palette-deep-blue;
        }
    }

    .exising-links {
        @include flex(column);
        margin: 1.25em 0;
        max-height: 15em;
        overflow: auto;
        color: $palette-deep-blue;

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
                background: $palette-tomatoe-red;
                @include font(600, 0.75em);
                padding: 0.35em 0.5em;
                color: white;
                border-radius: 0.15em;
                margin-left: 0.75em;
                transition: all 0.3s;
                cursor: pointer;
                text-transform: uppercase;

                &:hover {
                    background: darken($palette-tomatoe-red, 2);
                }
            }
        }

        .placeholder {
            text-align: center;
            margin: 1em 0;
            @include font(400, 0.85em);
            color: $palette-deep-blue;
        }
    }

    .actions {
        @include flex(row, center, flex-end);

        button {
            @include font(400, 0.85em);
            color: white;
            padding: 0.5em 1em;
            border-radius: 0.15em;
            transition: all 0.3s;
            margin-left: 0.5em;
        }

        .add {
            background: $palette-theme-primary;

            &:hover {
                background: darken($palette-theme-primary, 2);
            }
        }

        .remove-all {
            background: $palette-tomatoe-red;

            &:hover {
                background: darken($palette-tomatoe-red, 2);
            }
        }
    }

    @include mobile {
        .exising-links {
            padding: 0 0.5em;
        }
    }

</style>
