# Installing on Linux
Vue Cloudfront is based on open source technologies which **should** in theory work perfectly well on most of the leading operating systems.
However, I develop the project using Windows machines.

## Requirements

1. Install [LTS version of Node.js for Linux](https://nodejs.org/en/download/package-manager/)
2. Install [MongoDB for Linux](https://docs.mongodb.com/manual/administration/install-on-linux/)
3. You can [download Github Desktop](https://desktop.github.com/) to get access not only for fancy UI but for git toolset itself.

## Installation of vue-cloudfront-api

1. Open bash with [Git](https://git-scm.com/download/win) access or use Github desktop
2. Clone the [vue-cloudfront-api](https://github.com/Simonwep/vue-cloudfront-api) project:

```bash
git clone https://github.com/Simonwep/vue-cloudfront-api
```

3. Go to `vue-cloudfront-api` in dir:

```bash
cd vue-cloudfront-api
```

4. Install dependencies:

```bash
npm install
```

5. Run API:

```bash
npm run dev
```

## Installation of vue-cloudfront

1. Open bash with [Git](https://git-scm.com/download/win) access or use Github desktop
2. Clone the [vue-cloudfront](https://github.com/Simonwep/vue-cloudfront) project:

```bash
git clone https://github.com/DivanteLtd/vue-cloudfront.git
```

3. Go to `vue-cloudfront` directory:

```
cd vue-cloudfront
```

4. Install dependencies:

```bash
npm install
```

5. Run Vue Cloudfront Server:

```bash
npm run dev
```

Now you should have Vue Cloudfront running on `localhost:3000`.
