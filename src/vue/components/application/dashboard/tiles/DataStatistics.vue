<template>
    <doughnut-chart v-slot="{item}"
                    :values="fileTypes.values"
                    :labels="fileTypes.names"
                    :stroke-width="2.75"
                    class="data-statistics">

        <!-- Label template -->
        <div :style="{'--color': item.color}"
             :class="{label: 1, clickable: item.label !== 'other'}"
             @click="(item.label !== 'other') && search(item)">
            <span></span>
            <p>{{ item.label }}</p>
        </div>

    </doughnut-chart>
</template>

<script>

    // Components
    import DoughnutChart from '../../../../ui/specific/DoughnutChart';

    export default {

        components: {DoughnutChart},

        data() {
            return {

                // Map each extension to it's name to process it faster later
                transformedExtensionsMap: (() => {
                    const newMap = {};

                    for (const [name, types] of Object.entries(this.$config.extensionMap)) {
                        for (const type of types) {
                            newMap[type] = name;
                        }
                    }

                    return newMap;
                })()
            };
        },

        computed: {

            fileTypes() {
                const {transformedExtensionsMap} = this;
                const {nodes} = this.$store.state;
                const extensions = {other: 0};

                // Collect extension data
                for (let i = 0, l = nodes.length; i < l; i++) {
                    const name = nodes[i].name;
                    const extension = name.substring(name.lastIndexOf('.') + 1).toLowerCase();

                    if (extension in transformedExtensionsMap) {
                        const name = transformedExtensionsMap[extension];
                        extensions[name] = (extensions[name] | 0) + 1;
                    } else {
                        extensions.other++;
                    }
                }

                // Move elements with to small percentual amount to other
                for (const key in extensions) {
                    if ((extensions[key] / nodes.length) < 0.01) {
                        extensions.other += extensions[key];
                        delete extensions[key];
                    }
                }

                // Convert to percent
                const values = [];
                const names = [];
                for (const name in extensions) {
                    names.push(name);
                    values.push(extensions[name] / nodes.length);
                }

                return {values, names};
            }
        },

        methods: {
            search({label}) {
                const query = `is:${this.$config.extensionMap[label].join(',')}`;
                this.$store.commit('setActiveTab', 'home');
                this.$store.dispatch('search/update', query);
            }
        }
    };

</script>

<style lang="scss" scoped>

    .label {
        @include flex(row, center);
        padding: 0.25em 0.5em 0.3em;
        margin: 0.05em 0.05em 0 0;
        border-radius: 0.15em;

        span {
            display: inline-block;
            @include size(8px);
            border-radius: 2px;
            margin-right: 0.35em;
            margin-bottom: -2px;
            background: #{'var(--color)'};
        }

        p {
            @include font(600, 0.8em);
            position: relative;
            text-transform: capitalize;
            color: RGB(var(--primary-text-color));

            &::before {
                @include pseudo();
                @include position(auto, 0, -3px, 0);
                @include size(1px, 0);
                transition: all 0.3s;
            }
        }

        &.clickable {
            cursor: pointer;

            &:hover p::before {
                width: 100%;
                background: RGB(var(--primary-text-color));
            }
        }
    }

</style>
