import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('make sublogger', async () => {
    const { msg, log } = await createMockLogger();
    const sublog = log.sublogger('live-player');
    sublog.info('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg;
    assert.deepStrictEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app.live-player 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`,
    );
});

test('make sublogger with bad chars', async () => {
    const { msg, log } = await createMockLogger();
    const sublog = log.sublogger('fett ÅÄÖ hej2!!!');
    sublog.info('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg;
    assert.deepStrictEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app.fetthej2 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`,
    );
});
