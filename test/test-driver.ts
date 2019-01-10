import test from 'ava';
import { rfc5424Row, Facility, SyslogSeverity } from '../src/driver';

test('rfc5424Row - message', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - - - - hello world\n');
});

test('rfc5424Row - hostname', t => {
    const row = rfc5424Row({
        facility: Facility.Local1,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        hostname: 'i-12345677.eu-west1',
    });
    t.is(row, '<142>1 2019-01-10T07:22:49.669Z i-12345677.eu-west1 - - - - hello world\n');
});

test('rfc5424Row - appname', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Debug,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        appName: 'site-liveplayer',
    });
    t.is(row, '<135>1 2019-01-10T07:22:49.669Z - site-liveplayer - - - hello world\n');
});

test('rfc5424Row - procid (number)', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        pid: 12345,
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - 12345 - - hello world\n');
});

test('rfc5424Row - procid (string)', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        pid: 'yo',
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - yo - - hello world\n');
});

test('rfc5424Row - msgid', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        msgId: 'abcd12345',
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - - abcd12345 - hello world\n');
});

test('rfc5424Row - logglyKey', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        logglyKey: 'abcd12345',
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - - - [abcd12345@41058] hello world\n');
});

test('rfc5424Row - tags', t => {
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
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - - - [foo="abc47" bar="123yy"] hello world\n');
});

test('rfc5424Row - tags escaping', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        tags: {
            foo: 'a"bc\\4]7',
        },
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - - - [foo="a\\"bc\\\\4\\]7"] hello world\n');
});

test('rfc5424Row - loggly + tags', t => {
    const row = rfc5424Row({
        facility: Facility.Local0,
        severity: SyslogSeverity.Informational,
        message: 'hello world',
        timestamp: new Date(1547104969669),
        logglyKey: 'abcd',
        tags: {
            foo: 'abc47',
        },
    });
    t.is(row, '<134>1 2019-01-10T07:22:49.669Z - - - - [abcd@41058 foo="abc47"] hello world\n');
});
