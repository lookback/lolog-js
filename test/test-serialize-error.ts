import test from 'ava';
import { serializeError } from '../src';

test('serializeError', t => {
    const serialized = serializeError(new Error('Foo'));
    t.is(serialized.message, 'Foo');
    t.is(serialized.name, 'Error');
    t.is(typeof serialized.stack, 'string');
});
