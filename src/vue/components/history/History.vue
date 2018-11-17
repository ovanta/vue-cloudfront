<template>
    <div class="history">

        <div class="header">
            <h1>History</h1>
            <i class="fas fa-fw fa-trash" @click="clearActions()"></i>
        </div>

        <div class="action actions-header">
            <span class="name">Action</span>
            <span class="description"></span>
            <span class="performed">Performed</span>
            <span class="timestamp">Timestamp</span>
        </div>

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

                <span class="performed">{{ (now - action.timestamp) | readableTimeStampDiff }}</span>
                <span class="timestamp">{{ action.timestamp | readableTimestamp }}</span>
            </div>
        </div>

    </div>
</template>

<script>
    export default {

        data() {
            return {
                actions: [],

                now: Date.now(),
                interval: null
            };
        },

        mounted() {

            /**
             * Receives a node list and returns a pretty string represention
             * of it.
             *
             * @param nds
             * @returns {string}
             */
            const pluralify = nds => {
                const maxCount = 3;

                // Strange case, return nothing
                if (!nds.length) {
                    return 'nothing';
                }

                // If theres only one node, return type and the name of it
                if (nds.length === 1) {
                    return `${nds[0].type} ${nds[0].name}`;
                }

                // Create a comma-seperated list of names
                const end = nds.length > maxCount ? maxCount : nds.length - 1;
                const nodesStr = nds.slice(0, end).map(v => v.name).join(', ');

                if (nds.length <= maxCount) {
                    return `${nodesStr} and ${nds[end].name}`;
                } else {

                    /**
                     * If there is only one more node, just append it.
                     * Otherwise append 'x others' because '1 others' sounds odd.
                     */
                    const rest = nds.length - maxCount;
                    return `${nodesStr} and ` + (rest === 1 ? nds[maxCount].name : `${rest} others`);
                }
            };

            // Each action / mutation gets a unique color
            const colorMap = {
                'Update': '#66BB6A',
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
                'Delete': 'fas fa-fw fa-trash-alt',
                'Add Mark': 'fas fa-fw fa-bookmark',
                'Remove Mark': 'far fa-bookmark',
                'Rename': 'fas fa-fw fa-pen',
                'Create Folder': 'fas fa-fw fa-folder',
                'Move': 'fas fa-fw fa-cut',
                'Copy': 'fas fa-fw fa-copy',
                'Change Color': 'fas fa-fw fa-palette'
            };

            // Map of functions which generate a description of each action the user perform
            const descriptionMap = {
                'Update': () =>
                    `Nodes updated.`,

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

                // Push action
                this.actions.push({
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
                    description: (name in descriptionMap) && descriptionMap[name](payload) || 'No details available',

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

            // Use interval to update current time every 30 seconds
            this.interval = setInterval(() => this.now = Date.now(), 30000);
        },

        methods: {

            clearActions() {
                this.actions.splice(0, this.actions.length);
            }

        }
    };
</script>

<style lang="scss" scoped>

    .history {
        @include flex(column);
        margin: 2em 1.5em 0 1.5em;

        .header {
            @include flex(row, center);
            border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
            padding-bottom: 0.25em;

            h1 {
                @include font(400, 1.25em);
                color: $palette-deep-blue;
                margin-right: auto;
            }

            i {
                font-size: 1em;
                color: $palette-decent-blue;
                transition: all 0.3s;
                cursor: pointer;

                &:hover {
                    color: $palette-tomatoe-red;
                }
            }
        }
    }

    .actions {
        margin: 1em 0.5em 0 0.5em;
        overflow: auto;
    }

    .action {
        @include flex(row, center);
        @include font(600, 0.75em);
        border-bottom: 1px solid rgba($palette-deep-blue, 0.04);
        padding: 0.5em 0;
        color: $palette-deep-blue;

        .name {
            @include flex(row, center);
            border-bottom: 2px solid rgba(black, 0.1);
            padding: 0.15em 0.5em;
            border-radius: 0.15em;
            color: white;
            margin-right: auto;
            text-shadow: 1px 1px 0 rgba(black, 0.05);

            i {
                font-size: 0.85em;
                margin-right: 0.5em;
            }
        }

        .description {
            @include flex(row, center);
            width: 45%;
            margin-right: 2em;

            .text {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .change-color {
                display: inline-block;
                @include size(15px);
                border: 1px solid rgba(black, 0.1);
                margin-left: 0.5em;
                border-radius: 50% 50% 65% 50% / 40% 65% 35% 60%;
                flex-shrink: 0;
            }
        }

        .timestamp,
        .performed {
            opacity: 0.75;
            width: 18%;
        }

        &:last-child {
            border: none;
        }

        &.actions-header {
            position: relative;
            font-size: 0.85em;
            margin: 1.5em 0.5em 0 0.5em;

            .name {
                color: $palette-deep-blue;
                border: none;
                padding-left: 0;
                text-shadow: none;
            }
        }
    }


</style>
