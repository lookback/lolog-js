import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('log data', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669 }, { random: 42 });
    const m = await msg;
    assert.deepEqual(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hi {"data":{"random":42}}\n`);
});

test('log userId and data', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669, userId: 'u123' }, { random: 42 });
    const m = await msg;
    assert.deepEqual(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hi ` +
        `{"userId":"u123","data":{"random":42}}\n`);
});
