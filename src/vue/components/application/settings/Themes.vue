<template>
    <div class="themes">

        <div class="setting">
            <article>
                Choose a palette which you want to use.
                Your selected theme will be synchronized with other sessions.
            </article>


            <div class="input">
                <div v-for="theme of themes"
                     :class="{theme: 1, active: theme.name === settings.user.theme}"
                     :data-name="`Choose ${theme.name} theme`"
                     @click="select(theme.name)">

                    <div v-for="color of theme.colors"
                         :style="{background: color}"
                         :title="color"
                         class="color"></div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>

    // Theme stylesheet
    import themeStyleSheet from '!raw-loader!../../../../scss/themes.scss';

    // Vuex stuff
    import {mapState} from 'vuex';

    export default {

        data() {
            const {matchAll} = this.$utils;

            return {
                themes: (() => {
                    const sections = matchAll(themeStyleSheet, /^[\w#]+\.?([\w]+)? {([\n\r\W\S]+?)}/gm);
                    const themes = [];

                    for (const [, variant, styles] of sections) {
                        themes.push({
                            name: variant || 'default',
                            colors: matchAll(styles, /--([\w-]+): ([\d]+, [\d]+, [\d]+);/g)
                                .filter(v => !v[1].startsWith('static'))
                                .map(v => `rgb(${v[2]})`)
                        });
                    }

                    return themes;
                })()
            };
        },

        computed: {
            ...mapState(['settings'])
        },

        methods: {

            select(theme) {
                this.$store.dispatch('settings/change', state => {
                    state.user.theme = theme;
                    return state;
                });
            }
        }
    };

</script>

<style lang="scss" scoped>

    .themes {
        width: 100%;
        max-width: 25em;

        .theme {
            @include size(2.5em, 100%);
            @include flex(row, center, center);
            position: relative;
            margin-bottom: 0.5em;
            border-radius: 0.2em;
            overflow: hidden;
            cursor: pointer;
            transition: all 0.3s;
            border: 2px solid RGB(var(--secondary-background-color));

            .color {
                @include size(100%);
            }

            &:not(.active)::before {
                @include pseudo();
                @include position(0, 0, 0, 0);
                @include font(600, 0.8em);
                text-align: center;
                line-height: 2.8em;
                content: attr(data-name);
                background: RGBA(var(--primary-background-color), 0.5);
                color: RGB(var(--primary-text-color));
                opacity: 0;
                transition: all 0.3s;
            }

            &:hover::before {
                opacity: 1;
            }
        }
    }

</style>
