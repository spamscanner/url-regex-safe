const test = require('ava');

const urlRegex = require('..');

const fixtures = [
  "http://-.~_!$&'()*+';=:%40:80%2f::::::@example.com",
  '//223.255.255.254',
  '//a.b-c.de',
  '//foo.ws',
  '//localhost:8080',
  '//userid:password@example.com',
  '//➡.ws/䨹',
  'ftp://foo.bar/baz',
  'http://1337.net',
  'http://142.42.1.1/',
  'http://142.42.1.1:8080/',
  'http://223.255.255.254',
  'http://a.b-c.de',
  'http://a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.com',
  'http://a_b.z.com',
  'http://code.google.com/events/#&product=browser',
  'http://example.com#foo',
  'http://example.com.',
  'http://example.com?foo=bar',
  'http://foo.bar/?q=Test%20URL-encoded%20stuff',
  'http://foo.com/(something)?after=parens',
  'http://foo.com/blah_(wikipedia)#cite-1',
  'http://foo.com/blah_(wikipedia)_blah#cite-1',
  'http://foo.com/blah_blah',
  'http://foo.com/blah_blah/',
  'http://foo.com/blah_blah_(wikipedia)',
  'http://foo.com/blah_blah_(wikipedia)_(again)',
  'http://foo.com/unicode_(✪)_in_parens',
  'http://j.mp',
  'http://localhost/',
  'http://mw1.google.com/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg',
  'http://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body',
  'http://userid:password@example.com',
  'http://userid:password@example.com/',
  'http://userid:password@example.com:8080',
  'http://userid:password@example.com:8080/',
  'http://userid@example.com',
  'http://userid@example.com/',
  'http://userid@example.com:8080',
  'http://userid@example.com:8080/',
  'http://www.example.com/wpstyle/?p=364',
  'http://www.microsoft.xn--comindex-g03d.html.irongeek.com',
  'http://⌘.ws',
  'http://⌘.ws/',
  'http://☺.damowmow.com/',
  'http://✪df.ws/123',
  'http://➡.ws/䨹',
  'https://www.example.com/foo/?bar=baz&inga=42&quux',
  'ws://223.255.255.254',
  'ws://a.b-c.de',
  'ws://foo.ws',
  'ws://localhost:8080',
  'ws://userid:password@example.com',
  'ws://➡.ws/䨹',
  'www.google.com/unicorn'
];
for (const x of fixtures) {
  test(`match exact URLs: ${x}`, (t) => {
    t.true(urlRegex({ exact: true, auth: true, parens: true }).test(x));
  });
}

for (const x of [
  'http://مثال.إختبار',
  'http://उदाहरण.परीक्षा',
  'http://例子.测试'
]) {
  test(`match exact URLs with strict set to true: ${x}`, (t) => {
    t.true(
      urlRegex({ exact: true, strict: true, auth: true, parens: true }).test(x)
    );
  });
}

test('match URLs in text', (t) => {
  const fixture = `
		Foo //bar.net/?q=Query with spaces
		Lorem ipsum //dolor.sit
		<a href="http://example.com">example.com</a>
		<a href="http://example.com/with-path">with path</a>
		[and another](https://another.example.com) and
	`;

  t.deepEqual(
    [
      '//bar.net/?q=Query',
      '//dolor.sit',
      'http://example.com',
      'http://example.com/with-path',
      'https://another.example.com'
    ],
    fixture.match(urlRegex({ strict: true }))
  );
});

for (const x of [
  'http://',
  'http://.',
  'http://..',
  'http://../',
  'http://?',
  'http://??',
  'http://??/',
  'http://#',
  'http://##',
  'http://##/',
  'http://foo.bar?q=Spaces should be encoded',
  '//',
  '//a',
  '///a',
  '///',
  'http:///a',
  'rdar://1234',
  'h://test',
  'http:// shouldfail.com',
  ':// should fail',
  'http://foo.bar/foo(bar)baz quux',
  'http://-error-.invalid/',
  'http://-a.b.co',
  'http://a.b-.co',
  'http://123.123.123',
  'http://3628126748',
  'http://.www.foo.bar/',
  'http://.www.foo.bar./',
  'http://go/ogle.com',
  'http://foo.bar/ /',
  'http://a.b_z.com',
  'http://ab_.z.com',
  'http://google\\.com',
  'http://www(google.com',
  'http://www.example.xn--overly-long-punycode-test-string-test-tests-123-test-test123/',
  'http://www=google.com',
  'https://www.g.com/error\n/bleh/bleh',
  '/foo.bar/',
  '///www.foo.bar./'
]) {
  test(`do not match URLs: ${x}`, (t) => {
    t.false(urlRegex({ exact: true }).test(x));
  });
}

test('do not match URLs: foo.com', (t) => {
  t.false(urlRegex({ exact: true, strict: true }).test('foo.com'));
});

for (const x of [
  "-.~_!$&'()*+';=:%40:80%2f::::::@example.com",
  '//223.255.255.254',
  '//a.b-c.de',
  '//foo.ws',
  '//localhost:8080',
  '//userid:password@example.com',
  '//➡.ws/䨹',
  '1337.net',
  '142.42.1.1/',
  '142.42.1.1:8080/',
  '223.255.255.254',
  'a.b-c.de',
  'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.com',
  'code.google.com/events/#&product=browser',
  'example.com#foo',
  'example.com',
  'example.com.',
  'example.com?foo=bar',
  'foo.bar/?q=Test%20URL-encoded%20stuff',
  'foo.bar/baz',
  'foo.com/(something)?after=parens',
  'foo.com/blah_(wikipedia)#cite-1',
  'foo.com/blah_(wikipedia)_blah#cite-1',
  'foo.com/blah_blah',
  'foo.com/blah_blah/',
  'foo.com/blah_blah_(wikipedia)',
  'foo.com/blah_blah_(wikipedia)_(again)',
  'foo.com/unicode_(✪)_in_parens',
  'foo.ws',
  'google.com',
  'j.mp',
  'localhost/',
  'localhost:8080',
  'mw1.google.com/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg',
  'user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body',
  'userid:password@example.com',
  'userid:password@example.com/',
  'userid:password@example.com:8080',
  'userid:password@example.com:8080/',
  'userid@example.com',
  'userid@example.com/',
  'userid@example.com:8080',
  'userid@example.com:8080/',
  'www.example.com/foo/?bar=baz&inga=42&quux',
  'www.example.com/wpstyle/?p=364',
  'www.google.com/unicorn',
  'www.microsoft.xn--comindex-g03d.html.irongeek.com',
  '⌘.ws',
  '⌘.ws/',
  '☺.damowmow.com/',
  '✪df.ws/123',
  '➡.ws/䨹'
]) {
  test(`match using list of TLDs: ${x}`, (t) => {
    t.true(urlRegex({ exact: true, auth: true, parens: true }).test(x));
  });
}

test('opt out of matching basic auth', (t) => {
  const strictFixturesWithAuth = [
    "http://-.~_!$&'()*+';=:%40:80%2f::::::@example.com",
    'http://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body',
    'http://userid:password@example.com',
    'http://userid:password@example.com/with/path',
    'http://userid:password@example.com:8080',
    'http://userid:password@example.com:8080/path',
    'http://userid@example.com',
    'http://userid@example.com/with/path',
    'http://userid@localhost:8080',
    'http://userid@localhost:8080/path'
  ];

  for (const x of strictFixturesWithAuth) {
    // With protocol
    t.false(urlRegex({ exact: true, strict: true, auth: false }).test(x));

    // Relative protocol
    t.false(urlRegex({ exact: true, auth: false }).test(x.replace('http', '')));

    // No protocol
    t.false(
      urlRegex({ exact: true, auth: false }).test(x.replace('http://', ''))
    );
  }

  const textFixture = `
		Lorem ipsum http://userid:password@example.com:8080 dolor sit
		<a href="http://userid:password@example.com:8080/">example.com</a>
		another //userid:password@example.com one
		bites //userid:password@example.com/with/path the dust
		and http://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body another one
		and <a href="http://user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body">another one</a>
		and another <a href="userid:password@example.com">one gone</a>
		and another userid@example.com one gone
		another http://userid@example.com/ one
		bites http://userid@localhost:8080 the
		dust http://userid@localhost:8080/path
	`;

  // Strict matches none because auth always breaks the url
  t.is(
    null,
    textFixture.match(urlRegex({ exact: false, strict: true, auth: false }))
  );

  // Non-strict will only match domain:port/path as auth separates the protocol
  const textFixtureMatches = [
    'example.com:8080',
    'example.com:8080/',
    'example.com',
    'example.com',
    'example.com/with/path',
    'example.com:123/one/two.three?q1=a1&q2=a2#body',
    'example.com:123/one/two.three?q1=a1&q2=a2#body',
    'example.com',
    'example.com',
    'example.com/',
    'localhost:8080',
    'localhost:8080/path'
  ];

  // With protocol
  t.deepEqual(
    textFixtureMatches,
    textFixture.match(urlRegex({ exact: false, auth: false }))
  );

  // Relative protocol
  t.deepEqual(
    textFixtureMatches,
    textFixture.replace('http:', '').match(urlRegex())
  );

  // No protocol
  t.deepEqual(
    textFixtureMatches,
    textFixture.replace('http://', '').match(urlRegex())
  );
});

test('match using explicit list of TLDs', (t) => {
  const fixtures = [
    "-.~_!$&'()*+';=:%40:80%2f::::::@example.com",
    "-.~_!$&'()*+';=:%40:80%2f::::::@example.onion",
    '//223.255.255.254',
    '//a.b-c.de',
    '//foo.ws',
    '//localhost:8080',
    '//userid:password@example.com',
    '//➡.onion/䨹',
    '//➡.ws/䨹',
    '1337.net',
    '142.42.1.1/',
    '142.42.1.1:8080/',
    '223.255.255.254',
    'a.b-c.de',
    'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.com',
    'code.google.com/events/#&product=browser',
    'example.com#foo',
    'example.com.',
    'example.com?foo=bar',
    'example.onion',
    'foo.bar/?q=Test%20URL-encoded%20stuff',
    'foo.bar/baz',
    'foo.com/(something)?after=parens',
    'foo.com/blah_(wikipedia)#cite-1',
    'foo.com/blah_(wikipedia)_blah#cite-1',
    'foo.com/blah_blah',
    'foo.com/blah_blah/',
    'foo.com/blah_blah_(wikipedia)',
    'foo.com/blah_blah_(wikipedia)_(again)',
    'foo.com/unicode_(✪)_in_parens',
    'foo.ws',
    'j.mp',
    'localhost/',
    'localhost:8080',
    'mw1.google.com/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg',
    'mw1.unicorn.education/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg',
    'unicorn.education',
    'user:pass@example.com:123/one/two.three?q1=a1&q2=a2#body',
    'userid:password@example.com',
    'userid:password@example.com/',
    'userid:password@example.com:8080',
    'userid:password@example.com:8080/',
    'userid:password@example.education',
    'userid@example.com',
    'userid@example.com/',
    'userid@example.com:8080',
    'userid@example.com:8080/',
    'www.example.com/foo/?bar=baz&inga=42&quux',
    'www.example.com/wpstyle/?p=364',
    'www.example.onion/wpstyle/?p=364',
    'www.google.com/unicorn',
    'www.microsoft.xn--comindex-g03d.html.irongeek.com',
    '⌘.ws',
    '⌘.ws/',
    '☺.damowmow.com/',
    '✪df.ws/123',
    '➡.ws/䨹'
  ];

  for (const x of fixtures) {
    t.true(
      urlRegex({
        exact: true,
        auth: true,
        parens: true,
        tlds: ['com', 'ws', 'de', 'net', 'mp', 'bar', 'onion', 'education']
      }).test(x)
    );
  }
});

test('fail if not in explicit list of TLDs', (t) => {
  const fixtures = [
    "-.~_!$&'()*+';=:%40:80%2f::::::@example.biz",
    '//a.b-c.uk',
    '//foo.uk',
    '//userid:password@example.biz',
    '//➡.cn/䨹',
    '1337.biz',
    'a.b-c.cn',
    'a.b-c.ly',
    'a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.biz',
    'code.google.biz/events/#&product=browser',
    'example.biz#foo',
    'example.biz.',
    'example.biz?foo=bar',
    'foo.baz/?q=Test%20URL-encoded%20stuff',
    'foo.baz/baz',
    'foo.baz/blah_blah',
    'foo.biz/(something)?after=parens',
    'foo.biz/blah_(wikipedia)#cite-1',
    'foo.biz/blah_(wikipedia)_blah#cite-1',
    'foo.biz/blah_blah_(wikipedia)',
    'foo.biz/unicode_(✪)_in_parens',
    'foo.co.uk/blah_blah/',
    'foo.jp',
    'foo.onion/blah_blah_(wikipedia)_(again)',
    'j.onion',
    'mw1.google.biz/mw-earth-vectordb/kml-samples/gp/seattle/gigapxl/$[level]/r$[y]_c$[x].jpg',
    'user:pass@example.biz:123/one/two.three?q1=a1&q2=a2#body',
    'userid:password@example.biz',
    'userid:password@example.biz/',
    'userid:password@example.biz:8080',
    'userid:password@example.biz:8080/',
    'userid@example.biz',
    'userid@example.biz/',
    'userid@example.biz:8080',
    'userid@example.biz:8080/',
    'www.example.biz/foo/?bar=baz&inga=42&quux',
    'www.example.education/wpstyle/?p=364',
    'www.google.biz/unicorn',
    'www.microsoft.xn--comindex-g03d.html.irongeek.biz',
    '⌘.onion',
    '⌘.onion/',
    '☺.damowmow.biz/',
    '✪df.onion/123',
    '➡.onion/䨹',
    '➡.uk/䨹'
  ];

  for (const x of fixtures) {
    t.false(
      urlRegex({
        exact: true,
        auth: true,
        parens: true,
        tlds: ['com', 'ws', 'de', 'net', 'mp', 'bar']
      }).test(x)
    );
  }
});

test('do not match URLs with non-strict mode', (t) => {
  t.false(
    urlRegex({ exact: true, auth: true, parens: true }).test(
      '018137.113.215.4074.138.129.172220.179.206.94180.213.144.175250.45.147.1364868726sgdm6nohQ'
    )
  );
});

test('IPv4', (t) => {
  t.true(urlRegex().test('1.1.1.1'));
  t.false(urlRegex({ ipv4: false }).test('1.1.1.1'));
});

test('IPv6', (t) => {
  t.true(urlRegex().test('2606:4700:4700::1111'));
  t.false(urlRegex({ ipv6: false }).test('2606:4700:4700::1111'));
});

test('parses similar to Gmail by default', (t) => {
  t.deepEqual(
    "foo@bar.com [foo]@bar.com foo bar @foob.com 'text@example.com, some text'".match(
      urlRegex()
    ),
    ['bar.com', 'bar.com', 'foob.com', 'example.com']
  );
});

test('does not allow apostrophe in path', (t) => {
  t.deepEqual(
    "background: url('http://example.com/pic.jpg');".match(urlRegex()),
    ['http://example.com/pic.jpg']
  );
});
