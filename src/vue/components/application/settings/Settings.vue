<template>
    <div class="settings">

        <div class="menu">
            <p>Settings</p>

            <div class="btns">
                <button v-for="(sub, index) of subs"
                        :key="index"
                        :class="{active: active === sub.com}"
                        @click="active = sub.com">
                    {{ sub.name }}
                </button>
            </div>
        </div>

        <div class="content">
            <component :is="active"/>
        </div>

    </div>
</template>

<script>

    // Sub-menus
    const req = require.context('./subs', false, /\.(vue|js)$/i);

    export default {
        data() {
            const subs = req.keys().map(key => {
                const name = key.split('/').pop().replace(/\..*$/, '');
                const com = require(`./subs/${name}`).default;
                return {com, name};
            }).sort((a, b) => b.name.length - a.name.length);

            return {
                active: subs[0].com,
                subs
            };
        }
    };

</script>

<style lang="scss">

    .setting.setting {
        @include flex(column);
        margin: 1em 0;
        padding: 0.75em;
        background: RGB(var(--primary-background-color));
        border-radius: 0.15em;
        border: 2px solid RGB(var(--secondary-background-color));

        > article {
            @include font(600, 0.8em);
            line-height: 1.5em;

            code {
                font-size: 0.8em;
                background: RGB(var(--primary-text-color));
                color: RGB(var(--secondary-background-color));
                padding: 0.2em 0.5em 0.15em;
                border-radius: 0.15em;
                margin: 0 0.25em;
            }
        }

        .input {
            width: 100%;
            padding-top: 0.75em;
            margin-top: 0.75em;
            border-top: 2px solid RGB(var(--secondary-background-color));
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
        color: RGB(var(--primary-text-color));

        .menu {
            height: 100%;
            padding: 0.75em 2em;
            border-right: 2px solid RGB(var(--secondary-background-color));

            > p {
                @include font(600, 0.9em);
                margin-bottom: 0.75em;

                @include animate('0.5s ease-out') {
                    from {
                        opacity: 0;
                        transform: translateY(-0.5em);
                    }
                    to {
                        opacity: 1;
                        transform: none;
                    }
                }
            }

            button {
                @include font(600, 0.75em);
                color: RGB(var(--secondary-text-color));
                width: 100%;
                padding: 0.75em 0.25em;
                margin: 0.35em 0;
                border-radius: 0.15em;
                transition: all 0.3s;
                opacity: 0;
                transform: translateX(-2em);

                &.active {
                    background: RGB(var(--theme-secondary));
                    color: RGB(var(--teritary-text-color));
                }

                &:hover:not(.active) {
                    background: RGB(var(--secondary-background-color));
                }

                @include sequential-animation-delay(3, 0.1s);
                @include animate('0.5s ease-out forwards') {
                    to {
                        opacity: 1;
                        transform: none;
                    }
                }
            }
        }

        .content {
            @include flex(column, flex-start, flex-start);
            @include size(100%);
            padding: 0 2em;
            overflow: auto;

            @include animate('0.5s ease-out forwards') {
                from {
                    opacity: 0;
                    transform: translateY(-0.5em);
                }
                to {
                    opacity: 1;
                    transform: none;
                }
            }
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
