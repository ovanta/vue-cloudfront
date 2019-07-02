<template>
    <div class="settings">

        <div class="menu">
            <p>Settings</p>
            <button :class="{active: menu === 'credentials'}" @click="menu = 'credentials'">Credentials</button>
            <button :class="{active: menu === 'appereance'}" @click="menu = 'appereance'">Appereance</button>
        </div>

        <div class="content">
            <credentials v-show="menu === 'credentials'"/>
            <appereance v-show="menu === 'appereance'"/>
        </div>

    </div>
</template>

<script>

    // Setting parts
    import Credentials from './Credentials';
    import Appereance  from './Appereance';

    export default {

        components: {Appereance, Credentials},

        data() {
            return {
                menu: 'credentials'
            };
        }
    };

</script>

<style lang="scss">

    .setting {
        @include flex(column);
        margin: 1em 0;
        padding: 0.75em;
        background: white;
        border-radius: 0.15em;
        border: 2px solid $palette-sick-white;

        > article {
            @include font(600, 0.8em);
            line-height: 1.5em;

            code {
                font-size: 0.8em;
                background: $palette-asphalt;
                color: $palette-snow-white;
                padding: 0.2em 0.5em 0.15em;
                border-radius: 0.15em;
            }
        }

        .input {
            padding-top: 0.75em;
            margin-top: 0.75em;
            border-top: 2px solid $palette-snow-white;
        }
    }

</style>

<style lang="scss" scoped>

    .settings {
        @include flex(row);
        @include width(40vw, 35em, 60em);
        margin: auto;
        padding: 5vh 0;
        flex-grow: 1;
        color: $palette-asphalt;

        .menu {
            height: 100%;
            padding: 0.75em 2em;
            border-right: 2px solid $palette-sick-white;

            > p {
                @include font(600, 0.9em);
                margin-bottom: 0.75em;
            }

            button {
                @include font(600, 0.75em);
                color: rgba(black, 0.4);
                width: 100%;
                padding: 0.75em 0.25em;
                margin: 0.35em 0;
                border-radius: 0.15em;
                transition: all 0.3s;

                &.active {
                    background: $palette-theme-secondary;
                    color: white;
                }

                &:hover:not(.active) {
                    background: rgba(black, 0.02);
                }
            }
        }

        .content {
            @include flex(column, flex-start, flex-start);
            @include size(100%);
            padding: 0 2em;
            overflow: auto;
        }
    }

    @include mq-phones {
        .settings {
            flex-direction: column;
            padding: 0;
            min-width: 100vw;

            .menu {
                height: auto;

                > p {
                    display: none;
                }
            }
        }
    }

</style>