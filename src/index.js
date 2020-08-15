const RE2 = require('re2');
const ipRegex = require('ip-regex');
const tlds = require('tlds');

/* istanbul ignore next */
const SafeRegExp = typeof RE2 === 'function' ? RE2 : RegExp;
const ipv4 = ipRegex.v4().source;
const ipv6 = ipRegex.v6().source;

module.exports = (options) => {
  options = {
    exact: false,
    strict: false,
    auth: false,
    parens: false,
    ipv4: true,
    ipv6: true,
    tlds,
    ...options
  };

  const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? '' : '?'}`;
  // Add option to disable matching urls with HTTP Basic Authentication
  // <https://github.com/kevva/url-regex/pull/63>
  const auth = options.auth ? '(?:\\S+(?::\\S*)?@)?' : '';
  const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
  const domain =
    '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
  // Add ability to pass custom list of tlds
  // <https://github.com/kevva/url-regex/pull/66>
  const tld = `(?:\\.${
    options.strict
      ? '(?:[a-z\\u00a1-\\uffff]{2,})'
      : `(?:${options.tlds.sort((a, b) => b.length - a.length).join('|')})`
  })\\.?`;
  const port = '(?::\\d{2,5})?';
  // Not accept closing parenthesis
  // <https://github.com/kevva/url-regex/pull/35>
  const path = options.parens ? '(?:[/?#][^\\s"]*)?' : '(?:[/?#][^\\s"\\)]*)?';
  // Added IPv6 support
  // <https://github.com/kevva/url-regex/issues/60>
  let regex = `(?:${protocol}|www\\.)${auth}(?:localhost|`;
  if (options.ipv4) regex += `${ipv4}|`;
  if (options.ipv6) regex += `${ipv6}|`;
  regex += `${host}${domain}${tld})${port}${path}`;

  return options.exact
    ? new SafeRegExp(`(?:^${regex}$)`, 'i')
    : new SafeRegExp(regex, 'ig');
};
