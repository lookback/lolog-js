import { test } from 'loltest';
import { serializeError } from '../src';
import assert from 'assert';

test('serializeError', () => {
    const serialized = serializeError(new Error('Foo'));
    assert.deepEqual(serialized.message, 'Foo');
    assert.deepEqual(serialized.name, 'Error');
    assert.deepEqual(typeof serialized.stack, 'string');
});
