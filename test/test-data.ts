import test from 'ava';
import { createMockLogger } from './_mock_logger';

test('log data', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669 }, { random: 42 });
    const m = await msg;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hi {"data":{"random":42}}\n`);
});

test('log userId and data', async t => {
    const { msg, log } = await createMockLogger();
    log.info('hi', { timestamp: 1547104969669, userId: 'u123' }, { random: 42 });
    const m = await msg;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hi {"userId":"u123","data":{"random":42}}\n`);
});
