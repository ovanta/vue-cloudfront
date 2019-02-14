<template>
    <tab-container title="History">

        <template slot="header">
            <i v-tooltip="'Clear history'"
               class="fas fa-fw fa-trash"
               @click="clearActions"></i>
        </template>

        <template slot="content">

            <!-- Column header with sorting buttons -->
            <div class="action actions-header">

                <div class="sort-container name" @click="sort('name')">
                    <span>Action</span>
                    <i :class="`fas fa-fw fa-caret-${sortDirs.name ? 'down' : 'up'}`"></i>
                </div>

                <span class="description"></span>

                <div class="sort-container performed" @click="sort('timestamp')">
                    <span>Performed</span>
                    <i :class="`fas fa-fw fa-caret-${sortDirs.timestamp ? 'down' : 'up'}`"></i>
                </div>
            </div>

            <!-- Actual list of actions -->
            <div class="actions">
                <div v-for="action of actions" class="action">

                    <span :style="{background: action.color}" class="name">
                        <i :class="action.iconClass"></i>
                        <span>{{ action.name }}</span>
                    </span>

                    <span class="description">
                        <span class="text">{{ action.description }}</span>

                        <!-- Additional payload info -->
                        <span v-if="action.payload.newColor"
                              :style="{background: action.payload.newColor}"
                              class="change-color"></span>
                    </span>

                    <span class="performed">{{ (timeReference - action.timestamp) | readableTimeStampDiff }}</span>
                </div>
            </div>
        </template>


    </tab-container>
</template>

<script>

    // Components
    import TabContainer from '../TabContainer';

    export default {

        components: {TabContainer},

        data() {
            return {
                actions: [],
                sortDirs: {
                    name: false,
                    timestamp: false
                },

                timeReference: Date.now(),
                interval: null
            };
        },

        mounted() {
            const pluralify = nodes => this.utils.createReadableString(nodes.slice(0, 4).map(v => v.name), 3);

            // Each action / mutation gets a unique color
            const colorMap = {
                'Update': '#C0CA33',
                'Put': '#8BC34A',
                'Create Folders': '#4CAF50',
                'Restore': '#86ad2c',
                'Zip': '#dc812e',
                'Delete': '#EF5350',
                'Add Mark': '#EC407A',
                'Remove Mark': '#AB47BC',
                'Rename': '#5C6BC0',
                'Create Folder': '#42A5F5',
                'Move': '#26C6DA',
                'Copy': '#26A69A',
                'Change Color': '#7E57C2'
            };

            // Each action / mutation also gets a fancy icon
            const iconMap = {
                'Update': 'fas fa-fw fa-sync-alt',
                'Restore': 'fas fa-fw fa-redo-alt',
                'Put': 'fas fa-fw fa-cloud-upload-alt',
                'Zip': 'fas fa-fw fa-file-archive',
                'Create Folders': 'fas fa-fw fa-folder-open',
                'Delete': 'fas fa-fw fa-trash-alt',
                'Add Mark': 'fas fa-fw fa-bookmark',
                'Remove Mark': 'far fa-fw fa-bookmark',
                'Rename': 'fas fa-fw fa-pen',
                'Create Folder': 'fas fa-fw fa-folder',
                'Move': 'fas fa-fw fa-cut',
                'Copy': 'fas fa-fw fa-copy',
                'Change Color': 'fas fa-fw fa-palette'
            };

            // Map of functions which generate a description of each action the user perform
            const descriptionMap = {
                'Update': () =>
                    `Cloud updated.`,

                'Put': payload =>
                    `Uploaded ${pluralify(payload.nodes)}`,

                'Zip': payload =>
                    `Zip ${pluralify(payload.nodes)}`,

                'Restore': payload =>
                    `Restored ${pluralify(payload)} from bin`,

                'Create Folders': payload =>
                    `Created ${pluralify(payload.folders)}`,

                'Delete': payload =>
                    `Deleted ${pluralify(payload)}.`,

                'Add Mark': payload =>
                    `Mark ${pluralify(payload)}.`,

                'Remove Mark': payload =>
                    `Remove Mark from ${pluralify(payload)}.`,

                'Rename': payload =>
                    `Rename ${payload.node.type} ${payload.node.name} to ${payload.newName}.`,

                'Create Folder': () =>
                    `New folder created.`,

                'Move': payload =>
                    `Move ${pluralify(payload.nodes)} to ${payload.destination.name}.`,

                'Copy': payload =>
                    `Copied ${pluralify(payload.nodes)} to ${payload.destination.name}.`,

                'Change Color': payload =>
                    `Change color of ${pluralify(payload.nodes)} to`
            };

            // Function which is responsible to handle actions / mutations
            const handle = ({type, payload}) => {

                // Skip mutations which are not related to nodes
                if (!type.startsWith('nodes')) {
                    return;
                }

                // Convert mutation / action -name to camel case
                const name = type.substring(6)
                    .match(/[A-Z][a-z]+|^[a-z]+/g)
                    .map(v => v[0].toUpperCase() + v.substr(1).toLowerCase())
                    .join(' ');

                // Check if a correspondending description is available
                if (!(name in descriptionMap)) {
                    return;
                }

                // Push action
                this.actions.splice(0, 0, {
                    name,

                    /**
                     * Color and icon class using font-awesome.
                     * Default values are present but shouldn't be used
                     */
                    color: colorMap[name] || '#ccc',
                    iconClass: iconMap[name] || 'fas fa-fw fa-question',

                    /**
                     * Description, here is also a default value
                     * present but it shouldn't be used.
                     */
                    description: descriptionMap[name](payload) || 'No details available',

                    // Timestamp when action was performed
                    timestamp: Date.now(),

                    // Additional props, currently only color present
                    payload: {
                        newColor: name === 'Change Color' ? payload.color : null
                    }
                });
            };

            // Bind listener
            this.$callOnDestroy(
                this.$store.subscribe(handle),
                this.$store.subscribeAction(handle)
            );

            // Update time-reference every 15 seconds
            setInterval(() => this.timeReference = Date.now(), 15000);
        },

        methods: {

            clearActions() {
                this.actions.splice(0, this.actions.length);
            },

            sort(type) {

                /**
                 * Values which are used to toggle
                 * each sorting type individually.
                 */
                const ra = this.sortDirs[type] ? -1 : 1;
                const rb = this.sortDirs[type] ? 1 : -1;

                // Find correct sorting function
                const sortFn = (() => {
                    switch (type) {
                        case 'name':
                            return (a, b) => a.name > b.name ? ra : rb;
                        case 'timestamp':
                            return (a, b) => a.timestamp > b.timestamp ? ra : rb;
                    }
                })();

                // Sort pre-calulated nodes and re-render everything
                this.actions.sort(sortFn);
                this.$forceUpdate();

                // Toggle sort-direction to descending / ascending
                this.sortDirs[type] = !this.sortDirs[type];
            }

        }
    };
</script>

<style lang="scss" scoped>

    .fa-trash {
        font-size: 1em;
        color: $palette-decent-blue;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            color: $palette-tomatoe-red;
        }
    }

    .actions {
        margin: 1em 0 0 0;
        overflow: auto;
    }

    .action {
        @include flex(row, center);
        @include font(600, 0.75em);
        border-bottom: 1px solid rgba($palette-deep-blue, 0.04);
        padding: 0.5em 0;
        color: $palette-deep-blue;
        flex-shrink: 0;

        @include animate('0.3s') {
            from {
                opacity: 0;
                transform: translateY(-0.2em);
            }
            to {
                opacity: 1;
                transform: none;
            }
        }

        .name {
            @include flex(row, center);
            border-bottom: 2px solid rgba(black, 0.1);
            padding: 0.4em 0.75em;
            color: white;
            margin-right: auto;
            text-shadow: 1px 1px 0 rgba(black, 0.05);
            font-size: 0.9em;

            i {
                font-size: 0.9em;
                margin-right: 0.5em;
                flex-shrink: 0;
            }

            span {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
        }

        .description {
            @include flex(row, center);
            width: 60%;
            margin: 0 1em;
            overflow: hidden;

            .text {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                line-height: 1.2em;
            }

            .change-color {
                display: inline-block;
                @include size(12px);
                border: 1px solid rgba(black, 0.1);
                margin-left: 0.5em;
                border-radius: 100%;
                flex-shrink: 0;
            }
        }

        .performed {
            opacity: 0.75;
            width: 20%;
            flex-shrink: 0;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        &:last-child {
            border: none;
        }

        &.actions-header {
            position: relative;

            .name {
                color: $palette-deep-blue;
                border: none;
                padding-left: 0;
                text-shadow: none;
            }

            .sort-container {
                @include flex(row, center);
                cursor: pointer;
                font-size: 1.05em;

                i {
                    font-size: inherit;
                    margin-left: 0.25em;
                }

                &:hover {
                    color: $palette-theme-primary;

                    .sort {
                        color: $palette-theme-primary;
                    }
                }
            }
        }
    }

</style>
