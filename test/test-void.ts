import test from 'ava';
import { createVoidLogger } from '../src';

test('create void logger', t => {
    const logger = createVoidLogger();
    t.truthy(logger);
    logger.info("hello world");
});

test('create void sublogger', t => {
    const logger = createVoidLogger();
    const sub = logger.sublogger("foo");
    t.truthy(sub);
    sub.info("hello world");
});
