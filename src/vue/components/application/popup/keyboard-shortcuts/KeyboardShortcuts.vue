<template>
    <popup store-prop="KeyboardShortcuts" title="Keyboard Shortcuts">
        <div class="shortcut-sections">
            <section v-for="sec of sections"
                     :key="sec.name"
                     class="shortcut-section">

                <h2>{{ sec.name }}</h2>

                <div v-for="shortcut of sec.shortcuts"
                     :key="shortcut.action"
                     class="shortcut">

                    <div class="keys">
                        <span v-for="key of shortcut.keys"
                              :key="key"
                              class="key">{{ key }}</span>
                    </div>

                    <p>{{ shortcut.action }}</p>
                </div>
            </section>
        </div>
    </popup>
</template>

<script>

    // Components
    import Popup from '../Popup';

    // Shortcuts
    import selecingShortcuts from './shortcuts/selecting';
    import generalShortcuts  from './shortcuts/general';
    import actionShortcuts   from './shortcuts/actions';
    import helpShortcuts     from './shortcuts/help';

    export default {
        components: {Popup},

        data() {
            return {
                sections: [
                    selecingShortcuts,
                    actionShortcuts,
                    generalShortcuts,
                    helpShortcuts
                ]
            };
        },

        mounted() {
            this.$callOnDestroy(
                this.$utils.detectKeypressCombinations(
                    document,
                    this.keyboardEvent,
                    ({target}) => target.getAttribute('contenteditable') !== 'true' && !['TEXT-AREA', 'INPUT'].includes(target.tagName)
                )
            );
        },

        methods: {

            keyboardEvent(pressedKeys, event) {
                const handler = [
                    selecingShortcuts,
                    generalShortcuts,
                    actionShortcuts,
                    helpShortcuts
                ];

                // Define nodes as function to prevent
                // useless calculations. Returns, if there is, the search result
                // or all nodes which are currently into view.
                const nodes = () => this.$store.getters['nodes/currentDisplayedNodes']();
                const shortcuts = handler.reduce((pv, cv) => pv.concat(cv.shortcuts), [])
                    .sort((a, b) => b.keys.length - a.keys.length);

                for (const {keys, fn} of shortcuts) {
                    if (keys.every(key => pressedKeys.get(key))) {

                        // Seems like theres another handler for it
                        if (!fn) {
                            return;
                        }

                        fn({
                            event,
                            nodes,
                            mediaDevice: this.$mediaDevice
                        });
                        return;
                    }
                }
            }
        }
    };

</script>

<style lang="scss" scoped>

    .shortcut-sections {
        @include flex(row, flex-start, space-between);
        flex-wrap: wrap;
    }

    .shortcut-section {
        @include flex(column);
        width: 48%;

        h2 {
            @include font(400, 0.9em);
            padding: 0.75em 0 0.25em;
            border-bottom: 1px solid RGB(var(--secondary-background-color));
            margin-bottom: 0.5em;
            color: RGB(var(--primary-text-color));
        }

        .shortcut {
            @include flex(row, center);
            padding: 0.25em 0;

            .keys {
                flex-grow: 1;
                font-family: monospace;
                @include font(600, 0.9em);

                .key {
                    margin-right: 0.5em;
                    color: RGB(var(--primary-text-color));
                    border: 1px solid RGBA(var(--primary-text-color), 0.75);
                    border-bottom: 2px solid RGBA(var(--primary-text-color), 0.9);
                    border-radius: 2px;
                    padding: 0.05em 0.45em 0.1em 0.45em;
                }
            }

            p {
                @include font(400, 0.8em);
                color: RGB(var(--primary-text-color));
                text-align: right;
            }
        }
    }

    @include mq-phones {
        .shortcut-sections {
            flex-direction: column;
            padding-right: 0.5em;
        }

        .shortcut-section {
            width: 100%;
        }
    }

</style>
