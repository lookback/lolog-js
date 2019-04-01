import { test } from 'loltest';
import { createVoidLogger } from '../src';
import assert from 'assert';

test('create void logger', () => {
    const logger = createVoidLogger();
    assert.ok(logger);
    logger.info("hello world");
});

test('create void sublogger', () => {
    const logger = createVoidLogger();
    const sub = logger.sublogger("foo");
    assert.ok(sub);
    sub.info("hello world");
});
