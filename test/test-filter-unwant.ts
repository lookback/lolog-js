import { test } from 'loltest';
import { filterUnwanted } from '../src/prepare';
import assert from 'assert';

test('filterUnwanted', () => {
    assert.deepStrictEqual(filterUnwanted(undefined), undefined);
    assert.deepStrictEqual(filterUnwanted(null), undefined);
    assert.deepStrictEqual(filterUnwanted(''), '');
    assert.deepStrictEqual(filterUnwanted(false), false);
    assert.deepStrictEqual(filterUnwanted(42), 42);
    assert.deepStrictEqual(filterUnwanted({}), {});
    assert.deepStrictEqual(filterUnwanted({ k: 42, j: 43 }), { k: 42, j: 43 });
    assert.deepStrictEqual(filterUnwanted({ k: undefined }), {});
    assert.deepStrictEqual(filterUnwanted({ k: Buffer.from('') }), {});
    assert.deepStrictEqual(filterUnwanted([]), []);
    assert.deepStrictEqual(filterUnwanted([1, 2]), [1, 2]);
    assert.deepStrictEqual(filterUnwanted([1, undefined]), [1]);
    assert.deepStrictEqual(filterUnwanted([1, new Set()]), [1]);
    assert.deepStrictEqual(filterUnwanted({ k: [] }), { k: [] });
    assert.deepStrictEqual(filterUnwanted({ k: [1, 2] }), { k: [1, 2] });
    assert.deepStrictEqual(filterUnwanted({ k: [1, undefined] }), { k: [1] });
    assert.deepStrictEqual(filterUnwanted([1, {}]), [1, {}]);
    assert.deepStrictEqual(filterUnwanted([1, { k: 42 }]), [1, { k: 42 }]);
    assert.deepStrictEqual(filterUnwanted([1, { k: 42, j: undefined }]), [1, { k: 42 }]);

    const err = filterUnwanted({ cause: new Error('Msg') });
    assert.deepStrictEqual(err.cause.name, 'Error');
    assert.deepStrictEqual(err.cause.message, 'Msg');
});
