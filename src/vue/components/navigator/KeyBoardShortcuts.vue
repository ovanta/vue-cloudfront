<template>
    <section :class="{shortcuts: 1, open}">

        <div class="container">

            <div class="header">
                <span class="title">Keyboard Shortcuts</span>
                <i class="material-icons close-btn" @click="open = false">close</i>
            </div>


            <section class="shortcut-section" v-for="sec of sections">

                <h2>{{ sec.name }}</h2>

                <div class="shortcut" v-for="shortcut of sec.shortcuts">
                    <div class="keys">
                        <span class="key" v-for="key of shortcut.keys">{{ key }}</span>
                    </div>

                    <p>{{ shortcut.action }}</p>
                </div>
            </section>

        </div>

    </section>
</template>


<script>

    export default {

        data() {
            return {
                open: false,
                sections: [

                    {
                        name: 'Selecting',
                        shortcuts: [
                            {keys: ['ctrl', 'shift'], action: 'Select everything up to current element.'},
                            {keys: ['ctrl', 'a'], action: 'Select everything.'},
                            {keys: ['s', 'esc'], action: 'Clear selection.'},
                            {keys: ['s', 'd'], action: 'Select directories.'},
                            {keys: ['s', 'f'], action: 'Select files.'},
                            {keys: ['s', 'i'], action: 'Invert selection.'}
                        ]
                    },

                    {
                        name: 'Actions',
                        shortcuts: [
                            {keys: ['ctrl', 'x'], action: 'Cut folder / files.'},
                            {keys: ['ctrl', 'v'], action: 'Paste folder / files.'},
                            {keys: ['n', 'f'], action: 'Create new folder.'}
                        ]
                    },

                    {
                        name: 'General',
                        shortcuts: [
                            {keys: ['v', 'l'], action: 'Change view to list.'},
                            {keys: ['v', 'g'], action: 'Change view to grid.'},
                            {keys: ['g', 'u'], action: 'Go up in hierarchy.'},
                            {keys: ['h', 'k'], action: 'Show keyboard shortcuts.'},
                            {keys: ['esc'], action: 'Close any popup like menu or this page.'},
                            {keys: ['delete'], action: 'Deletes currently selected files / folders.'}
                        ]
                    }

                ]
            };
        },

        mounted() {

            // Close via escape key
            window.addEventListener('keyup', e => e.key === 'Escape' && (this.open = false));

            this.$on('toggle', () => this.open = !this.open);
            this.$on('show', () => this.open = true);
        }
    };

</script>


<style lang="scss" scoped>

    .shortcuts {
        position: absolute;
        @include position(0, 0, 0, 0);
        @include flex(row, center, center);
        transform: translateY(-10px);
        visibility: hidden;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s, visibility 0.3s 0s;
        background: rgba($palette-deep-blue, 0.05);

        &.open {
            transform: none;
            visibility: visible;
            opacity: 1;
        }
    }

    .shortcuts {

        .container {
            background: white;
            box-shadow: 0 8px 25px 0 rgba(black, 0.08), 0 0 5px 0 rgba(black, 0.02);
            padding: 1.25em 2em 2em;
            border-radius: 0.15em;

            .header {
                @include flex(row);

                .title {
                    color: $palette-deep-blue;
                    font-weight: 600;
                }

                .close-btn {
                    margin-left: auto;
                    padding-bottom: 0.5em;
                    color: $palette-grayish-blue;
                    transition: all 0.3s;
                    cursor: pointer;

                    &:hover {
                        color: $palette-tomatoe-red;
                    }
                }
            }
        }

        .shortcut-section {
            @include flex(column);

            h2 {
                @include font(400, 0.9em);
                padding: 0.75em 0 0.25em;
                border-bottom: 1px solid rgba($palette-deep-blue, 0.05);
                margin-bottom: 0.5em;
            }

            .shortcut {
                @include flex(row, center);
                padding-bottom: 0.5em;

                .keys {
                    flex-grow: 1;
                    font-family: monospace;
                    font-weight: 600;
                    margin-right: 2em;

                    .key {
                        margin-right: 0.5em;
                        color: $palette-cloud-blue;
                        border: 1px solid rgba($palette-cloud-blue, 0.75);
                        border-bottom: 2px solid rgba($palette-cloud-blue, 0.9);
                        border-radius: 2px;
                        padding: 0.1em 0.45em 0.15em 0.45em;
                    }
                }

                p {
                    font-size: 0.8em;
                    font-weight: 600;
                    color: darken($palette-grayish-blue, 15);
                }
            }
        }

    }

</style>
