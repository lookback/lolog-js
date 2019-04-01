import test from 'ava';
import { createMockLogger } from './_mock_logger';

test('log nothing', async t => {
    const { msg, log } = await createMockLogger();
    (log as any).trace();
    const m = await msg.catch(() => 'not sent');
    t.is(m, 'not sent');
});

test('hello world', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hello world', { timestamp: 1547104969669 });
    const m = await msg;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`);
});
