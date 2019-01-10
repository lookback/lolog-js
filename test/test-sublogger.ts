import test from 'ava';
import { createMockLogger } from './_mock_logger';

test('make sublogger', async t => {
    const { msg, log } = await createMockLogger();
    const sublog = log.sublogger('liveplayer');
    sublog.info('hello world', { timestamp: 1547104969669 });
    const m = await msg;
    const pid = process.pid;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app-liveplayer ${pid}` +
        ` - [apikey@41058] hello world\n`);
});
