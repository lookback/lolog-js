import { test } from 'loltest';
import { rfc5424Row, Facility, SyslogSeverity } from '../src/driver';
import assert from 'assert';

test('rfc5424Row - message', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - - - - hello world\n');
});

test('rfc5424Row - hostname', () => {
    const row = rfc5424Row({
        facility: Facility.Local1,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        hostname: 'i-12345677.eu-west1',
    });
    assert.deepEqual(row, '<142>1 2019-01-10T07:22:49.669Z ' +
      'i-12345677.eu-west1 - - - - hello world\n');
});

test('rfc5424Row - appname', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Debug,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        appName: 'site-liveplayer',
    });
    assert.deepEqual(row, '<135>1 2019-01-10T07:22:49.669Z - site-liveplayer - - - hello world\n');
});

test('rfc5424Row - procid (number)', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        pid: 12345,
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - 12345 - - hello world\n');
});

test('rfc5424Row - procid (string)', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        pid: 'yo',
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - yo - - hello world\n');
});

test('rfc5424Row - msgid', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        msgId: 'abcd12345',
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - - abcd12345 - hello world\n');
});

test('rfc5424Row - apiKey', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        apiKeyId: 'chrome',
        apiKey: 'abcd12345',
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - - - ' +
    '[chrome@53595 apiKey="abcd12345"] hello world\n');
});

test('rfc5424Row - tags', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        tags: {
            foo: 'abc47',
            bar: '123yy',
        },
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - - - ' +
    '[foo="abc47" bar="123yy"] hello world\n');
});

test('rfc5424Row - tags escaping', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        tags: {
            foo: 'a"bc\\4]7',
        },
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - - - ' +
    '[foo="a\\"bc\\\\4\\]7"] hello world\n');
});

test('rfc5424Row - apiKey + tags', () => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        apiKeyId: 'chrome',
        apiKey: 'apikey',
        tags: {
            foo: 'abc47',
        },
    });
    assert.deepEqual(row, '<134>1 2019-01-10T07:22:49.669Z - - - - ' +
    '[chrome@53595 apiKey="apikey" foo="abc47"] hello world\n');
});
