export default {

    /**
     * API-Endpoint to rest api TODO: ADD-LINK
     * The API should stay behind a nginx proxy.
     */
    apiEndPoint: 'http://localhost:4001/api',

    /**
     * If folder / file sizes should be represent with
     * base 1000 or 1024. See https://en.wikipedia.org/wiki/Binary_prefix
     */
    sizeSIPrefix: false,

    /**
     * Messages which are shown in the loading screen.
     * Can be null to disable messages, a string to show a specific
     * one every time or an Array from which out a random message is getting picked
     * every time.
     */
    loadingScreenMessages: [
        'Smoothing buttons',
        'Procentually generating icons',
        'Dropping shadows',
        'Eliminating errors',
        'Wiping UI clean',
        'Reading discette',
        'Baking cookies',
        'Serving cookies',
        'Polishing input fields',
        'Organizing folders',
        'Writing expense reports',
        'Hiding errors under the rug',
        'Designing icons',
        'The cake is a lie!',
        'Calculating the meaning of life, the universe and everything',
        'Polarizing matrices',
        'Good Morning, Mr. Freeman.',
        'Todo: remove arrow from knee',
        'Baaaaaa!',
        'Remembering to bring a towel',
        'Excuse me, it\'s called a "feature'
    ],

    /**
     * Pre-defined colors for quick-selection in the ColorChooser component.
     */
    colors: [
        '#EF5350',
        '#EC407A',
        '#AB47BC',
        '#7E57C2',
        '#5C6BC0',
        '#42A5F5',
        '#29B6F6',
        '#26C6DA',
        '#26A69A',
        '#66BB6A',
        '#9CCC65',
        '#D4E157',
        '#FFEE58',
        '#FFCA28',
        '#FFA726',
        '#FF7043',
        '#8D6E63',
        '#BDBDBD'
    ]

};
