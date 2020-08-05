import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('not send trace', async () => {
    const { msg, log } = await createMockLogger();
    log.trace('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg.catch(() => 'not sent');
    assert.deepEqual(m, 'not sent');
});

test('default will send debug', async () => {
    const { msg, log } = await createMockLogger();
    log.debug('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg.catch(() => 'not sent');
    assert.deepEqual(m, '<135>1 2019-01-10T07:22:49.669Z testhost test-app 2.11 - [u@53595 apiKey="apikey" env="testing"] hello world\n');
});
