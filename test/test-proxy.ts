// tslint:disable

import test from 'ava';
import { createVoidLogger, createProxyLogger } from '../src';

test('create proxy', t => {
    const target = createVoidLogger();
    let foo = null;
    target.trace = (a: string) => {
        foo = a;
    };
    const logger = createProxyLogger(target);
    logger.trace('hello world');
    t.is(foo, 'hello world');
});

test('switch proxy', t => {
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
    t.is(foo1, null);
    t.is(foo2, 'hello world');
});
