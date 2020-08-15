# url-regex-safe

[![build status](https://img.shields.io/travis/com/niftylettuce/url-regex-safe.svg)](https://travis-ci.com/niftylettuce/url-regex-safe)
[![code coverage](https://img.shields.io/codecov/c/github/niftylettuce/url-regex-safe.svg)](https://codecov.io/gh/niftylettuce/url-regex-safe)
[![code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![made with lass](https://img.shields.io/badge/made_with-lass-95CC28.svg)](https://lass.js.org)
[![license](https://img.shields.io/github/license/niftylettuce/url-regex-safe.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dt/url-regex-safe.svg)](https://npm.im/url-regex-safe)

> Regular expression matching for URL's. Maintained, safe, and browser-friendly version of [url-regex][]. Resolves [CVE-2020-7661][cve] for Node.js servers.


## Table of Contents

* [Foreword](#foreword)
* [Install](#install)
* [Usage](#usage)
  * [Node](#node)
  * [Browser](#browser)
* [Options](#options)
* [Tips](#tips)
* [Contributors](#contributors)
* [License](#license)


## Foreword

After discovering [CVE-2020-7661][cve] and disclosing it [publicly](https://portswigger.net/daily-swig/unpatched-regex-bug-leaves-node-js-apps-open-to-redos-attacks) (through my work on [Spam Scanner][spam-scanner] and [Forward Email][forward-email]) – I used an implementation of [url-regex][] with some extra glue on top to filter out bad URL matches.

However after using it on [Forward Email][forward-email] in production (which processes hundreds of thousands of emails per week), I found and documented several more [core issues](https://github.com/kevva/url-regex/pull/35) with [url-regex][].

Realizing that [url-regex][] is no longer actively maintained, has 9 open pull requests as of this writing, and also lacked browser support – I decided to write this package for everyone and merge all the open pull requests.

This package should hopefully more closely resemble real-world intended usage of a URL regular expression, and also allowing the user to configure it as they wish.  Please check out [Forward Email][forward-email] if this package helped you, and explore our source code on GitHub which shows how we use this package.


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

### Node

We've resolved [CVE-2020-7661][cve] by including [RE2][] for Node.js usage.  You will not have to manually wrap your URL regular expressions with `new RE2(urlRegex())` anymore through `url-regex-safe` (we do it automatically for you).

```js
const urlRegexSafe = require('url-regex-safe');

const str = 'some long string with url.com in it';
const matches = str.match(urlRegexSafe());

for (const match of matches) {
  console.log('match', match);
}

console.log(urlRegexSafe().test('github.com'));
```

### Browser

Since [RE2][] is not made for the browser, it will not be used, and therefore [CVE-2020-7661][cve] is still an issue on the client-side. However it is not severe since the most it would do is crash the browser tab (as on the Node.js side it would have crashed the entire process and thrown an out of memory exception).

#### VanillaJS

This is the solution for you if you're just using `<script>` tags everywhere!

```html
<script src="https://unpkg.com/url-regex-safe"></script>
<script type="text/javascript">
  (function() {
    var str = 'some long string with url.com in it';
    var matches = str.match(urlRegexSafe());

    for (var i=0; i<matches.length; i++) {
      console.log('match', matches[i]);
    }

    console.log(urlRegexSafe().test('github.com'));
  })();
</script>
```

#### Bundler

Assuming you are using [browserify][], [webpack][], [rollup][], or another bundler, you can simply follow [Node](#node) usage above.


## Options

| Property | Type    | Default Value                                                | Description                                                                                                                                                                                                                                                                                                                                                    |   |
| -------- | ------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | - |
| `exact`  | Boolean | `false`                                                      | Only match an exact String. Useful with `regex.test(str)` to check if a String is a URL. We set this to `false` by default in order to match String values such as `github.com` (as opposed to requiring a protocol or `www` subdomain).  We feel this closely more resembles real-world intended usage of this package.                                       |   |
| `strict` | Boolean | `false`                                                      | Force URL's to start with a valid protocol or `www`.  If it is `false`, then it will match the TLD against the list of valid TLD's using [tlds](https://github.com/stephenmathieson/node-tlds#readme).                                                                                                                                                         |   |
| `auth`   | Boolean | `false`                                                      | Match against Basic Authentication headers. We set this to `false` by default since [it was deprecated in Chromium](https://bugs.chromium.org/p/chromium/issues/detail?id=82250#c7), and otherwise it leaves the user with unwanted URL matches (more closely resembles real-world intended usage of this package by having it set to `false` by default too). |   |
| `parens` | Boolean | `false`                                                      | Match against Markdown-style trailing parenthesis. We set this to `false` because it should be up to the user to parse for Markdown URL's.                                                                                                                                                                                                                     |   |
| `ipv4`   | Boolean | `true`                                                       | Match against IPv4 URL's.                                                                                                                                                                                                                                                                                                                                      |   |
| `ipv6`   | Boolean | `true`                                                       | Match against IPv6 URL's.                                                                                                                                                                                                                                                                                                                                      |   |
| `tlds`   | Array   | [tlds](https://github.com/stephenmathieson/node-tlds#readme) | Match against a specific list of tlds, or the default list provided by [tlds](https://github.com/stephenmathieson/node-tlds#readme).                                                                                                                                                                                                                           |   |


## Tips

You must override the default and set `strict: true` if you do not wish to match `github.com` by itself (though `www.github.com` will work if `strict: false`).

Unlike the deprecated and unmaintained package [url-regex][], we set `strict` and `auth` to `false` by default, so if you want to match that package's behavior out of the box, you will need to set these option values to `true`.  Also note that we added `parens` and `ipv6` options, setting `parens` to `false` and `ipv6` to `true`, therefore you will need to set `parens` to `true` and `ipv6` to `false` if you wish to match [url-regex][] behavior.


## Contributors

| Name                 | Website                    |
| -------------------- | -------------------------- |
| **Nick Baugh**       | <http://niftylettuce.com/> |
| **Kevin Mårtensson** |                            |
| **Diego Perini**     |                            |


## License

[MIT](LICENSE) © [Nick Baugh](http://niftylettuce.com/)


## 

[npm]: https://www.npmjs.com/

[yarn]: https://yarnpkg.com/

[cve]: https://nvd.nist.gov/vuln/detail/CVE-2020-7661

[re2]: https://github.com/uhop/node-re2

[browserify]: https://github.com/browserify/browserify

[webpack]: https://github.com/webpack/webpack

[rollup]: https://github.com/rollup/rollup

[url-regex]: https://github.com/kevva/url-regex

[spam-scanner]: https://spamscanner.net

[forward-email]: https://forwardemail.net
