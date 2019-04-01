// tslint:disable

import { test } from 'loltest';
import { createVoidLogger, createProxyLogger } from '../src';
import assert from 'assert';

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
