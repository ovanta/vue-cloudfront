<template>
    <bordered-pie-chart v-slot="{item}"
                        :values="fileTypes.values"
                        :labels="fileTypes.names"
                        :stroke-width="2.75"
                        class="data-statistics">
        <div :style="{'--color': item.color}" class="label">
            <span></span>
            <p>{{ item.label }}</p>
        </div>
    </bordered-pie-chart>
</template>

<script>

    // Config
    import config from '../../../../../../config/config.json';

    // Components
    import BorderedPieChart from '../../../../ui/specific/DoughnutChart';

    // Map each extension to it's name to process it faster later
    const transformedExtensionsMap = (() => {
        const newMap = {};

        for (const [name, types] of Object.entries(config.extensionMap)) {
            for (const type of types) {
                newMap[type] = name;
            }
        }

        return newMap;
    })();

    export default {

        components: {BorderedPieChart},

        data() {
            return {};
        },

        computed: {

            fileTypes() {
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
        }
    };

</script>

<style lang="scss" scoped>

    .label {
        @include flex(row, center);
        padding: 0.25em 0.5em 0.3em;
        margin: 0.05em 0.05em 0 0;
        cursor: pointer;
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
            color: $palette-asphalt;
        }
    }

</style>
