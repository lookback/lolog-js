import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('analytics track', async () => {
    const { msg, log } = await createMockLogger();
    log.track('Opens Link', <any>{ timestamp: 1547104969669, userId: 'user123' }, { 'Random Data': 42 });
    const m = await msg;
    assert.deepEqual(m, `<134>1 2019-01-10T07:22:49.669Z testhost tracking 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] Opens Link {"userId":"user123","data":{"Random Data":42}}\n`);
});
