import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('log recordingId', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', <any>{ timestamp: 1547104969669, recordingId: 'abc123' });
    const m = await msg;
    assert.deepStrictEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hi {"recordingId":"abc123"}\n`,
    );
});

test('log recordingId and userId', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', <any>{ timestamp: 1547104969669, recordingId: 'r123', userId: 'u123' });
    const m = await msg;
    assert.deepStrictEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hi ` +
            `{"recordingId":"r123","userId":"u123"}\n`,
    );
});

test('log recordingId as undefined', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', <any>{ timestamp: 1547104969669, recordingId: undefined });
    const m = await msg;
    assert.deepStrictEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hi\n`,
    );
});

test('log userIp', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', <any>{ timestamp: 1547104969669, userIp: '1.2.3.4' });
    const m = await msg;
    assert.deepStrictEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hi {\"userIp\":\"1.2.3.4\"}\n`,
    );
});
