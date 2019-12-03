import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';
import { __lastLogResult } from '../src';

const wait = (ms: number) => new Promise((rs) => setTimeout(rs, ms));

test('reconnect', async () => {
    const { msg, log } = await createMockLogger({
        timeout: 1000,
        disconnectFirst: true,
    }, {
        retryWait: 100,
    });
    // first will succeed since the tcp message will be handed off to the
    // kernel before we realise the socket has gone down.
    log.info('will succeed');
    await wait(100);
    // this should fail.
    log.info('should fail and then send');
    const m = await msg;
    assert.ok(m.includes('should fail and then send'));
    const result = await __lastLogResult;
    assert.deepEqual(result, { attempts: 2 });
});
