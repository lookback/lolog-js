import test from 'ava';
import { createMockLogger } from './_mock_logger';

test('log recordingId', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669, recordingId: 'abc123' });
    const m = await msg;
    const pid = process.pid;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app ${pid}` +
        ` - [apikey@41058 env="testing"] hi {"recordingId":"abc123"}\n`);
});

test('log recordingId and userId', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669, recordingId: 'r123', userId: 'u123' });
    const m = await msg;
    const pid = process.pid;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app ${pid}` +
        ` - [apikey@41058 env="testing"] hi {"recordingId":"r123","userId":"u123"}\n`);
});

test('log recordingId as undefined', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669, recordingId: undefined });
    const m = await msg;
    const pid = process.pid;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app ${pid}` +
        ` - [apikey@41058 env="testing"] hi\n`);
});

test('log version', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669, version: '2fcd85b' });
    const m = await msg;
    const pid = process.pid;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app ${pid}` +
        ` - [apikey@41058 env="testing"] hi {"version":"2fcd85b"}\n`);
});
