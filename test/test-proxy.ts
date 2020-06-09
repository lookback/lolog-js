import { test } from 'loltest';
import { createVoidLogger, createProxyLogger } from '../src';
import assert from 'assert';
import { createMockLogger } from './_mock_logger';

test('create proxy', () => {
    const target = createVoidLogger();
    let foo = null;
    target.trace = (a: string) => {
        foo = a;
    };
    const logger = createProxyLogger(target);
    logger.trace('hello world');
    assert.deepEqual(foo, 'hello world');
});

test('switch proxy', () => {
    const target1 = createVoidLogger();
    const target2 = createVoidLogger();
    let foo1 = null;
    let foo2 = null;
    target1.trace = (a: string) => {
        foo1 = a;
    };
    target2.trace = (a: string) => {
        foo2 = a;
    };
    const logger = createProxyLogger(target1);
    logger.setProxyTarget(target2);
    logger.trace('hello world');
    assert.deepEqual(foo1, null);
    assert.deepEqual(foo2, 'hello world');
});

test('create proxy sublogger', async () => {
    // a common scenario is to have a voidLogger during init and then
    // alter the proxy target later.
    const voidLog = createVoidLogger();
    const logger = createProxyLogger(voidLog);
    const sublog = logger.sublogger('live-player');
    const { msg, log } = await createMockLogger();
    logger.setProxyTarget(log);
    sublog.info('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg;
    assert.deepEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app.live-player 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`
    );
});

test('create proxy sublogger with same name', async () => {
    const voidLog = createVoidLogger();
    const logger = createProxyLogger(voidLog);
    const sublog1 = logger.sublogger('live-player');
    // risk that this overwrites the first sublogger
    logger.sublogger('live-player');
    const { msg, log } = await createMockLogger();
    logger.setProxyTarget(log);
    sublog1.info('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg;
    assert.deepEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost test-app.live-player 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`
    );
});

test('create proxy rootLogger', async () => {
    // a common scenario is to have a voidLogger during init and then
    // alter the proxy target later.
    const voidLog = createVoidLogger();
    const logger = createProxyLogger(voidLog);
    const sublog = logger.rootLogger('live-player');
    const { msg, log } = await createMockLogger();
    logger.setProxyTarget(log);
    sublog.info('hello world', <any>{ timestamp: 1547104969669 });
    const m = await msg;
    assert.deepEqual(
        m,
        `<134>1 2019-01-10T07:22:49.669Z testhost live-player 2.11` +
            ` - [u@53595 apiKey="apikey" env="testing"] hello world\n`
    );
});
