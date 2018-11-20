<template>
    <div
        v-if="open && !$store.state.skipIntroBoxes"
        ref="introBox"
        class="intro-box"
        @click="openIntroducion()">

        <!-- Bouncing question mark -->
        <svg
            class="question-mark"
            xmlns="http://www.w3.org/2000/svg"
            width="31"
            height="31"
            viewBox="0 0 31 31">
            <path
                d="M15.068-.013C20.569-.013,25,2.089,25,8c0,5.451-5.42,7.917-6.794,9.887-1.032,1.466-.687,3.523-3.524,3.523a2.7,2.7,0,0,1-2.75-2.808c0-4.991,7.518-6.122,7.518-10.232,0-2.263-1.544-3.6-4.124-3.6-5.5,0-4.3,5.124-7.326,5.233C6.5,10,5.043,9,5.012,7.743,5.012,3.631,9.825-.013,15.068-0.013ZM14.854,24.132a3.439,3.439,0,1,1-3.525,3.438A3.5,3.5,0,0,1,14.854,24.132Z"></path>
        </svg>

        <!-- Moving circles -->
        <span class="inner-circle"></span>
        <span class="outer-circle"></span>


        <!-- Text display -->
        <div
            ref="introContent"
            :class="{introduction: true, visible: intro}">
            <div class="header">
                <h1><i class="fa fa-fw fa-question-circle"></i>{{ header }}</h1>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 500 500">
                    <path
                        d="M26.178,311.221C30.934,213.593,48.052,81.843,252.526,55.3S491.238,400.319,467.462,438.232s-84.643-59.714-207.327-53.079S21.423,408.849,26.178,311.221Z"></path>
                </svg>
            </div>

            <div class="content">
                <p>{{ text }}</p>

                <div class="actions">
                    <span
                        class="skip"
                        @click="$store.commit('skipIntroBoxes', true)">Skip all</span>

                    <button @click="open = false">
                        <span>Okay</span>
                        <i class="fas fa-fw fa-check"></i>
                    </button>
                </div>

            </div>
        </div>

    </div>
</template>

<script>

    export default {

        props: {
            text: {
                type: String,
                required: true
            },
            header: {
                type: String,
                required: true
            }
        },

        data() {
            return {
                open: true,
                intro: false
            };
        },

        methods: {

            openIntroducion() {
                const {introBox, introContent} = this.$refs;

                // Center introductionbox below eye-catcher
                const ibc = introBox.getBoundingClientRect();
                const icc = introContent.getBoundingClientRect();
                introContent.style.marginLeft = `-${icc.width / 2 - ibc.width / 2}px`;

                // Show introbox
                this.intro = true;
            }

        }
    };


</script>


<style lang="scss" scoped>

    .intro-box {
        position: absolute;
        @include size(35px);
        @include position(-15px, -20px, auto, auto);
    }

    .question-mark {
        position: absolute;
        @include position(-150%, 0, 0, 0);
        @include size(20px);
        margin: auto;
        overflow: visible;
        opacity: 0.9;
        fill: $palette-deep-purple;
        cursor: pointer;

        @include animate('1.5s ease-in-out infinite') {
            0% {
                transform: none;
            }
            50% {
                transform: translate3d(0, -3px, 0);
            }
            100% {
                transform: none;
            }
        }

        animation-delay: 0.25s;
    }

    .inner-circle,
    .outer-circle {
        position: absolute;
        @include position(0, 0, 0, 0);
        margin: auto;
        display: inline-block;
        border-radius: 100%;
        cursor: pointer;
        z-index: 1;

        @include animate('1.5s ease-in-out infinite') {
            0% {
                transform: scale(1);
                opacity: 0.5;
            }
            50% {
                transform: scale(1.25);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0.5;
            }
        }
    }

    .inner-circle {
        @include size(16px);
        border: 2px solid $palette-bright-purple;
        animation-delay: 0.25s;
    }

    .outer-circle {
        @include size(20px);
        border: 2px solid $palette-deep-purple;
    }

    .introduction {
        position: fixed;
        background: white;
        border-radius: 0.2em;
        width: 15em;
        z-index: 1;
        opacity: 0;
        visibility: hidden;
        transform: translateY(2em);
        transition: opacity 0.3s, transform 0.3s, visibility 0s 0s;
        filter: drop-shadow(0 3px 8px rgba($palette-deep-blue, 0.2));

        &.visible {
            opacity: 1;
            transform: translateY(3em);
            visibility: visible;
        }

        &::before {
            @include pseudo();
            @include position(-20px, 0, auto, 0);
            @include size(0);
            margin: auto;
            border: 10px solid transparent;
            border-bottom-color: $palette-deep-purple;
        }

        .header {
            position: relative;
            background: $palette-deep-purple;
            padding: 0.5em 0.75em;
            color: #fff;
            border-radius: 0.2em 0.2em 0 0;
            overflow: hidden;

            h1 {
                @include font(400, 0.9em);

                i {
                    font-size: 1em;
                    margin-right: 0.5em;
                }
            }

            svg {
                position: absolute;
                @include position(-50%, -10%, -10%, auto);
                transform: rotate(30deg);
                margin: auto;
                height: 150%;
                fill: $palette-bright-purple;
            }
        }

        .content {
            @include flex(column);
            padding: 0.75em;
            border-radius: 0 0 0.2em 0.2em;

            p {
                @include font(400, 0.8em);
                color: rgba($palette-deep-blue, 0.75);
            }

            .actions {
                @include flex(row, flex-end, flex-end);

                button {
                    @include flex(row, center);
                    background: rgba(black, 0.1);
                    padding: 0.4em 0.85em 0.55em;
                    margin-top: 1em;
                    margin-left: 1em;
                    color: rgba(black, 0.5);
                    border-radius: 0.15em;
                    transition: all 0.3s;
                    @include font(600, 0.7em);

                    &:hover {
                        background: $palette-deep-purple;
                        color: white;
                    }

                    i {
                        font-size: 0.9em;
                        margin-left: 0.5em;
                        margin-top: 0.2em;
                    }
                }

                .skip {
                    font-size: 0.8em;
                    text-decoration: underline;
                    color: rgba($palette-grayish-blue, 0.75);
                    cursor: pointer;
                    transition: all 0.3s;

                    &:hover {
                        color: $palette-deep-purple;
                    }
                }
            }
        }
    }
</style>
