<template>
    <popup v-if="share.node"
           title="Share via link"
           store-prop="ShareViaLink"
           class="share-via-link">

        <h3>{{ share.node.name }}</h3>

        <!-- List of exising links -->
        <div class="exising-links">

            <div v-for="id of share.node.staticIds" class="link">
                <span>{{ apiEndPoint }}/download?id={{ id }}</span>
                <i class="fas fa-fw fa-times" @click="removeId(id)"></i>
            </div>

            <div v-if="!share.node.staticIds.length" class="placeholder">
                There are currently no static links attached...
            </div>

        </div>

        <button class="add" @click="requestId">Add link</button>

    </popup>
</template>

<script>

    // Config
    import config from '../../../../../config/config.json';

    // Components
    import Popup          from './Popover';
    import TextInputField from '../../../ui/TextInputField';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        components: {Popup, TextInputField},

        data() {
            return {
                apiEndPoint: config.apiEndPoint
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
                this.$store.dispatch('nodes/removeStaticId', {node: this.share.node, id});
            }
        }
    };

</script>

<style lang="scss" scoped>

    .share-via-link {
        @include flex(column);
        height: 100%;

        h3 {
            @include font(400, 0.9em);
            color: $palette-deep-blue;
            padding: 0.5em 0;
        }
    }

    .exising-links {
        @include flex(column);
        margin-top: 0.25em;
        max-height: 15em;
        overflow: auto;
        color: $palette-deep-blue;

        .link {
            @include flex(row, center);
            margin: 0.15em 0;
            flex-shrink: 0;

            span {
                @include font(500, 0.8em);
                width: 100%;
                user-select: all;
                cursor: pointer;
            }

            i {
                font-size: 1em;
                transition: all 0.3s;
                cursor: pointer;
                margin-left: 0.5em;

                &:hover {
                    color: $palette-tomatoe-red;
                }
            }
        }

        .placeholder {
            text-align: center;
            margin: 1em 0;
            @include font(400, 0.85em);
            color: $palette-decent-blue;
        }
    }

    .add {
        margin: 1.5em 0 0 auto;
        background: $palette-deep-purple;
        color: white;
        @include font(400, 0.85em);
        padding: 0.5em 1em;
        border-radius: 0.15em;
    }

</style>
