import { test } from 'loltest';
import { serializeError } from '../src';
import assert from 'assert';

test('serializeError', () => {
    const serialized = serializeError(new Error('Foo'));
    assert.deepStrictEqual(serialized.message, 'Foo');
    assert.deepStrictEqual(serialized.name, 'Error');
});
