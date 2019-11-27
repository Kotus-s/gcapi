<h1 align="center">Welcome to GCApi 👋</h1>
<p>
  <a href="https://discord.gg/bjDJJjy" target="_blank">
    <img alt="Discord GCA" src="https://discordapp.com/api/v6/guilds/223070469148901376/widget.png" />
  </a>
  <a href="https://travis-ci.com/Kotus-s/gcapi" target="_blank">
    <img alt="TravisCI" src="https://travis-ci.com/Kotus-s/gcapi.svg?branch=master" />
  </a>
  <a href="https://codeclimate.com/github/Kotus-s/gcapi/maintainability">
    <img src="https://api.codeclimate.com/v1/badges/a489c1ea485de09ac25a/maintainability" />
  </a>
  <a href="https://david-dm.org/Kotus-s/gcapi" title="dependencies status">
    <img src="https://david-dm.org/Kotus-s/gcapi/status.svg"/>
  </a>
  <a href="https://github.com/Kotus-s/gcapi/blob/master/LICENSE" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/github/license/Kotus-s/gcapi" />
  </a>
  <a href="https://github.com/carloscuesta/gitmoji" target="_blank">
    <img alt="gitmoji" src="https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg?style=flat-square" />
  </a>
  <a href="https://github.com/Kotus-s/gcapi/graphs/commit-activity" target="_blank">
    <img alt="Maintenance" src="https://img.shields.io/badge/Maintained%3F-yes-green.svg" />
  </a>
  <a href="https://www.npmjs.com/package/gcapi" target="_blank">
    <img alt="npm" src="https://img.shields.io/npm/dm/gcapi">
  </a>
</p>

> This package is simply a wrapper to used our API from [https://g-ca.fr/](https://g-ca.fr/)

### 🏠 [Homepage](https://github.com/Kotus-s/gcapi#readme)

## Prerequisites

- Node.js 0.10 or higher

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install gcapi
```

## Quick Start

```javascript
const gca = require('gcapi');

const gca = new GCApi({
  apiKey: process.env.API_KEY',
});

gca.getUserExperience(137329125223301130)
  .then((r) => r.sum)
  .catch((e) => console.error(e));
```

## Author

👤 **Kotus**

* Github: [@Kotus-s](https://github.com/Kotus-s)
* Discord: Kotus#0001

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/Kotus-s/gcapi/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Kotus](https://github.com/Kotus-s).<br />
This project is [MIT](https://github.com/Kotus-s/gcapi/blob/master/LICENSE) licensed.

***
