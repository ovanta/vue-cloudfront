<template>
    <section :class="{shortcuts: 1, open}">


        <div class="container">

            <div class="header">
                <span class="title">Keyboard Shortcuts</span>
                <i class="material-icons close-btn" @click="open = false">close</i>
            </div>

            <div class="shortcut" v-for="shortcut of shortcuts">

                <div class="keys">
                    <span class="key" v-for="key of shortcut.keys">{{ key }}</span>
                </div>

                <p>{{ shortcut.action }}</p>
            </div>

        </div>

    </section>
</template>


<script>

    export default {

        data() {
            return {
                open: false,
                shortcuts: [
                    {keys: ['ctrl', 'x'], action: 'Cut folder / files.'},
                    {keys: ['ctrl', 'v'], action: 'Paste folder / files.'},
                    {keys: ['ctrl', 'a'], action: 'Select everything.'},
                    {keys: ['l'], action: 'Change view to list.'},
                    {keys: ['g'], action: 'Change view to grid.'},
                    {keys: ['u'], action: 'Go up in hierarchy.'},
                    {keys: ['esc'], action: 'Close any popup like menu or this page.'},
                    {keys: ['delete'], action: 'Deletes currently selected files / folders.'},
                ]
            };
        },

        mounted() {

            // Close via escape key
            window.addEventListener('keyup', e => e.key === 'Escape' && (this.open = false));

            this.$on('toggle', () => this.open = !this.open);
        }
    };

</script>


<style lang="scss" scoped>

    .shortcuts {
        position: fixed;
        @include position(0, 0, 0, 0);
        @include flex(row, center, center);
        z-index: 10;
        transform: translateY(-10px);
        visibility: hidden;
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s, visibility 0.3s 0s;
        background: rgba(black, 0.05);

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
                    color: $palette-grayish-blue;
                }

                .close-btn {
                    margin-left: auto;
                    padding-bottom: 0.5em;
                    color: $palette-grayish-blue;
                    transition: all 0.3s;
                    cursor: pointer;

                    &:hover {
                        color: darken($palette-grayish-blue, 15);
                    }
                }
            }
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
                    color: $palette-grayish-blue;
                    border: 1px solid rgba($palette-grayish-blue, 0.75);
                    border-bottom: 2px solid rgba($palette-grayish-blue, 0.9);
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

</style>
