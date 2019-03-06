# Configuration file
Below is a description of each property in [config.json](https://github.com/vue-cloudfront/vue-cloudfront/blob/master/config/config.json) which
is used to define general behaviour of vue-cloudfront.

**`apiEndPoint`**  
Usually `/api`, all requests will be made through this specific url.

**`websocketEndPoint`**  
Usually `/ws`, websocket enpoint to enable real-time synchronization.

**`binaryPrefix`**  
If you switch to list-view also the file and directory size gets displayed. This property defines
if vue-cloudfront should use base `1000` or `1024` to calculate these.
See https://en.wikipedia.org/wiki/Binary_prefix for more info.

**`visibleNodesChunkSize`**  
How many 'nodes', e.g. folder / files should be loaded at once. To prevent rendering issues only a few nodes will be rendered at once.
If the user scroll's down the amount of visible nodes will be increased around `visibleNodesChunkSize`.

**`loadingScreenMessages`**  
Each time the user performs some kind of action that interacts with the server a loading screen appears with messages.
This prop can be either `null` to disable it, a string to set a fixed message or an Array from which a random one is chosen.
Thanks to [NateSeymour](https://github.com/NateSeymour), who provided the messages that are currently in use.

**`predefinedColors`**  
Pre-defined colors for [ColorChooser.vue](https://github.com/vue-cloudfront/vue-cloudfront/blob/master/src/vue/components/application/tabs/navigator/contextmenu/ColorChooser.vue).
Currently only used in the [ContextMenu](https://github.com/vue-cloudfront/vue-cloudfront/tree/master/src/vue/components/application/tabs/navigator/contextmenu)
