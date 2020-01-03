import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('override appName', async () => {
    const { msg, log } = await createMockLogger();
    log.info('hi', <any>{ timestamp: 1547104969669, appName: 'audit.ultron' });
    const m = await msg;
    assert.deepEqual(m, `<134>1 2019-01-10T07:22:49.669Z testhost audit.ultron 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hi\n`);
});
