import test from 'ava';
import { createMockLogger } from './_mock_logger';

test('make sublogger', async t => {
    const { msg, log } = await createMockLogger();
    const sublog = log.sublogger('live-player');
    sublog.info('hello world', { timestamp: 1547104969669 });
    const m = await msg;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app.live-player 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`);
});

test('make sublogger with bad chars', async t => {
    const { msg, log } = await createMockLogger();
    const sublog = log.sublogger('fett ÅÄÖ hej2!!!');
    sublog.info('hello world', { timestamp: 1547104969669 });
    const m = await msg;
    t.is(m, `<134>1 2019-01-10T07:22:49.669Z testhost test-app.fetthej2 2.11` +
        ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`);
});
