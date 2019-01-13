<h1 align="center">
    <img src="/docs/img/logo.png" alt="Logo">
</h1>

Vue Cloudfront is a standalone PWA cloudfront, mainly for self-hosting purposes. 
Currently the only backend-solution is the official [vue-cloudfront-api](https://github.com/Simonwep/vue-cloudfront-api) which is a fully-featured RESTful api. This project is and will always be open source, anybody can contribute to it - it should, and hopefully will be, a massive improvement regarding cloud solutions in contrast to google-drive and drop-box. The project is currently in the **alpha** phase.

For anyone who wants some guidance, feel free to contact me on Discord: 'Simon#6765'

## Features

Vue-cloudfront currently has full desktop and touch support (tablets / notebooks with touch support),
but no support for mobile devices (but [it's in progress](https://github.com/Simonwep/vue-cloudfront/tree/mobile-support))

All modern browsers like Chrome, Firefox, Opera and Edge are supported. **IE will never be supported!**

#### Vue Cloudfront - unique features
* 100% Offline support (Navigation and searching) - via [localStorage.](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).
* Ultra lightweight, only '~ 50kb' js and '~ 17kb' css! (both gzipped)
* Blazing fast with local caching: Average server response time: '~ 30ms' / Client-side rendering time: '~ 1.5s'
* Installable - [Install on desktop](https://developers.google.com/web/progressive-web-apps/desktop) (Currently only supported by Chrome 70+ under Linux, Windows and Chrome OS).
* Modern Vue frontend with material-design - easy to design and customize.
* Simply structure and just a few dependencies.
* MongoDB Backend.

#### File Management
* GridView with small file previews and draggable tiles.
* ListView with sortable columns and more details.
* Easy drag 'n drop as well as selection functionality.
* Files and folders can be marked _(for example to have quick access to them)_.
* Custom colors and color picker for faster content recognition.
* Almost no latency during a search.
* Copy, cut and move files and folders like on your notebook.
* Simultaneous uploads with a neat upload popup to control and see current uploads.

#### General
* Tooltips and introduction boxes to quickly understand how everything works.
* 29 Shortcuts, everything can also be done via a keyboard. No mouse at all required.
* File preview (currently only for images, videos, audio files, fonts and PDF).
* Search in your cloud and get results under '< 500ms'.
* Specify your search with file-type, size-range and more.

## Benchmarks
As a comparison, I compared the upload stats with these from google drive.
All benchmarks are made with an upload speed of `9.89 Mbit/s` / a ping of `~9ms`

##### Upload of node_modules (26.3MB, 7.567 Files and 590 Folders)
* Vue Cloudfront: `~58 Seconds` / `2 Requests`
* Google Drive: `~39 Minutes` / `9644 Requests`

##### Upload of one file (123MB)
* Vue Cloudfront: `~1 Minute and 53 Seconds` / `1 Request`
* Google Drive: `~2 Minutes and 10 Seconds` / `176 Requests`

##### Lighthouse analysis
![Lighthouse result](https://user-images.githubusercontent.com/30767528/51075890-f2239d00-1691-11e9-93e5-a34daad6fb0c.png)


## Documentation and table of contents

Currently and as already mentioned, this project is in its alpha phase. If all features and issues which I currently face are fixed and implemented, I will start to document stuff like config files, etc. Anyway the code is _(hopefully)_ well-equipped with comments.

Vue Cloudfront has been (so far) only deployed on an 'debian 9.5' instance, and I myself only work on Windows machines so the installation instructions on MacOS are only _assumed_ and based on these on Linux - If there are any issues/suggestions feel free to open a PR / Issue.

### Installation
* [Installing on MacOS](/docs/installation/mac.md)
* [Installing on Linux](/docs/installation/linux.md)
* [Installing on Windows](/docs/installation/windows.md)
* [Production setup](/docs/installation/production-setup.md)

See our [configuration docs](/docs/config.md) for further tweaks.

#### Vue Cloudfront stack
* [Vue as Framework](https://vuejs.org/)
* [Vuex as state management solution](https://vuex.vuejs.org/)
* [Fontawesome-free for fancy icons](https://fontawesome.com/)
* [Normalize.css for more consistently style](https://necolas.github.io/normalize.css/)
* [Selectionjs to provide selection experience like on your desktop](https://github.com/Simonwep/selection)
* [Service Worker to provive offline experience](https://developers.google.com/web/fundamentals/primers/service-workers/)
* [PWA](https://developers.google.com/web/progressive-web-apps/)

#### Vue Cloudfront-api stack
* [Express as Framework](https://expressjs.com/)
* [Mongoose as database API](https://mongoosejs.com/)
* [MongoDB as database](https://www.mongodb.com/)
