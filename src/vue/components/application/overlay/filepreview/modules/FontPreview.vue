<template>
    <div :style="{'font-family': loadFont(url)}"
         class="font-preview">

        <h6>The quick brown fox jumps over the lazy dog</h6>
        <h5>The quick brown fox jumps over the lazy dog</h5>
        <h4>The quick brown fox jumps over the lazy dog</h4>
        <h3>The quick brown fox jumps over the lazy dog</h3>
        <h2>The quick brown fox jumps over the lazy dog</h2>
        <h1>The quick brown fox jumps over the lazy dog</h1>

        <p>abcdefghijklmnopqrstuvwxyz<br>ABCDEFGHIJKLMNOPQRSTUVWXYZ<br>1234567890<br>!&quot;#$%&amp;'()*+,-./:;&lt;=&gt;?@[\]^_`{|}~</p>

    </div>
</template>

<script>

    export default {
        props: {
            url: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                loadedFonts: {}
            };
        },

        methods: {
            loadFont(url) {

                // Check if font has already been added
                if (this.loadedFonts[this.url]) {
                    return this.loadedFonts[this.url];
                }

                const name = `font-preview-${Date.now() + Math.floor(Math.random() * 100)}`;
                const style = document.createElement('style');
                style.innerHTML = `
                   @font-face {
                       font-family: '${name}';
                       src: url('${url}');
                   }
                `;

                document.head.appendChild(style);
                this.loadedFonts[this.url] = name;
                return name;
            }
        }
    };

</script>

<style lang="scss" scoped>

    .font-preview {
        font-size: 1em;

        > * {
            margin: 0.35em 0;
            font-weight: normal;
        }

        p {
            margin-top: 1em;
            line-height: 1.5em;
        }
    }

</style>
