import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('not send trace', async () => {
    const { msg, log } = await createMockLogger();
    log.trace('hello world', { timestamp: 1547104969669 });
    const m = await msg.catch(() => 'not sent');
    assert.deepEqual(m, 'not sent');
});

test('by default not send debug', async () => {
    const { msg, log } = await createMockLogger();
    log.debug('hello world', { timestamp: 1547104969669 });
    const m = await msg.catch(() => 'not sent');
    assert.deepEqual(m, 'not sent');
});

test('send debug if enabled', async () => {
    const { msg, log } = await createMockLogger();
    log.setDebug(true);
    log.debug('hello world', { timestamp: 1547104969669 });
    const m = await msg;
    assert.deepEqual(m, `<135>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
        ` - [u@53595 apiKey="apikey" environment="testing"] hello world\n`);
});

test('not send trace even if debug is enabled', async () => {
    const { msg, log } = await createMockLogger();
    log.setDebug(true);
    log.trace('hello world', { timestamp: 1547104969669 });
    const m = await msg.catch(() => 'not sent');
    assert.deepEqual(m, 'not sent');
});
