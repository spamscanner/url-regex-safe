const ipRegex = require('ip-regex');
const tlds = require('tlds');

const ipv4 = ipRegex.v4().source;
const ipv6 = ipRegex.v6().source;
const host = '(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)';
const domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
const strictTld = '(?:[a-z\\u00a1-\\uffff]{2,})';
const defaultTlds = `(?:${tlds.sort((a, b) => b.length - a.length).join('|')})`;
const port = '(?::\\d{2,5})?';

let RE2;
let hasRE2;

module.exports = (options) => {
  options = {
    //
    // attempt to use re2, if set to false will use RegExp
    // (we did this approach because we don't want to load in-memory re2 if users don't want it)
    // <https://github.com/spamscanner/url-regex-safe/issues/28>
    //
    re2: true,
    exact: false,
    strict: false,
    auth: false,
    localhost: true,
    parens: false,
    apostrophes: false,
    trailingPeriod: false,
    ipv4: true,
    ipv6: true,
    returnString: false,
    ...options
  };

  /* istanbul ignore next */
  const SafeRegExp =
    options.re2 && hasRE2 !== false
      ? (() => {
          if (typeof RE2 === 'function') return RE2;
          try {
            RE2 = require('re2');
            return typeof RE2 === 'function' ? RE2 : RegExp;
          } catch {
            hasRE2 = false;
            return RegExp;
          }
        })()
      : RegExp;

  const protocol = `(?:(?:[a-z]+:)?//)${options.strict ? '' : '?'}`;

  // Add option to disable matching urls with HTTP Basic Authentication
  // <https://github.com/kevva/url-regex/pull/63>
  const auth = options.auth ? '(?:\\S+(?::\\S*)?@)?' : '';

  // Add ability to pass custom list of tlds
  // <https://github.com/kevva/url-regex/pull/66>
  const tld = `(?:\\.${
    options.strict
      ? strictTld
      : options.tlds
      ? `(?:${options.tlds.sort((a, b) => b.length - a.length).join('|')})`
      : defaultTlds
  })${options.trailingPeriod ? '\\.?' : ''}`;

  let disallowedChars = '\\s"';
  if (!options.parens) {
    // Not accept closing parenthesis
    // <https://github.com/kevva/url-regex/pull/35>
    disallowedChars += '\\)';
  }

  if (!options.apostrophes) {
    // Don't allow apostrophes
    // <https://github.com/kevva/url-regex/pull/55>
    disallowedChars += "'";
  }

  const path = options.trailingPeriod
    ? `(?:[/?#][^${disallowedChars}]*)?`
    : `(?:(?:[/?#][^${disallowedChars}]*[^${disallowedChars}.?!])|[/])?`;

  // Added IPv6 support
  // <https://github.com/kevva/url-regex/issues/60>
  let regex = `(?:${protocol}|www\\.)${auth}(?:`;
  if (options.localhost) regex += 'localhost|';
  if (options.ipv4) regex += `${ipv4}|`;
  if (options.ipv6) regex += `${ipv6}|`;
  regex += `${host}${domain}${tld})${port}${path}`;

  // Add option to return the regex string instead of a RegExp
  if (options.returnString) return regex;

  return options.exact
    ? new SafeRegExp(`(?:^${regex}$)`, 'i')
    : new SafeRegExp(regex, 'ig');
};
