const path = require('node:path');
const { readFileSync } = require('node:fs');
const { Script } = require('node:vm');
const test = require('ava');
const { JSDOM, VirtualConsole } = require('jsdom');

const virtualConsole = new VirtualConsole();
virtualConsole.sendTo(console);

const script = new Script(
  readFileSync(path.join(__dirname, '..', 'dist', 'url-regex-safe.min.js'))
);

const dom = new JSDOM(``, {
  url: 'http://localhost:3000/',
  referrer: 'http://localhost:3000/',
  contentType: 'text/html',
  includeNodeLocations: true,
  resources: 'usable',
  runScripts: 'dangerously',
  virtualConsole
});

dom.runVMScript(script);

test('should work in the browser', (t) => {
  t.true(typeof dom.window.urlRegexSafe === 'function');
  t.true(dom.window.urlRegexSafe({ exact: true }).test('github.com'));
  t.deepEqual(
    'some long string with url.com in it'.match(dom.window.urlRegexSafe()),
    ['url.com']
  );
});
