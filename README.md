# url-regex-safe

[![build status](https://img.shields.io/travis/com/ladjs/url-regex-safe.svg)](https://travis-ci.com/ladjs/url-regex-safe)
[![code coverage](https://img.shields.io/codecov/c/github/ladjs/url-regex-safe.svg)](https://codecov.io/gh/ladjs/url-regex-safe)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/ladjs/url-regex-safe.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/url-regex-safe.svg)](https://npm.im/url-regex-safe)

> Regular expression matching for URL's. Maintained and safe version of url-regex. Resolves CVE-2020-7661.


## Table of Contents

* [Install](#install)
* [Usage](#usage)
* [Contributors](#contributors)
* [License](#license)


## Install

[npm][]:

```sh
npm install url-regex-safe
```

[yarn][]:

```sh
yarn add url-regex-safe
```


## Usage

```js
const UrlRegexSafe = require('url-regex-safe');

const urlRegexSafe = new UrlRegexSafe();

console.log(urlRegexSafe.renderName());
// script
```


## Contributors

| Name           | Website                    |
| -------------- | -------------------------- |
| **Nick Baugh** | <http://niftylettuce.com/> |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/
