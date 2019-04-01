import { test } from 'loltest';
import { filterUnwanted } from '../src/prepare';
import assert from 'assert';

test('filterUnwanted', () => {
    assert.deepEqual(filterUnwanted(undefined), undefined);
    assert.deepEqual(filterUnwanted(null), undefined);
    assert.deepEqual(filterUnwanted(''), '');
    assert.deepEqual(filterUnwanted(false), false);
    assert.deepEqual(filterUnwanted(42), 42);
    assert.deepEqual(filterUnwanted({}), {});
    assert.deepEqual(filterUnwanted({ k: 42, j: 43 }), { k: 42, j: 43 });
    assert.deepEqual(filterUnwanted({ k: undefined }), {});
    assert.deepEqual(filterUnwanted({ k: new Buffer('') }), {});
    assert.deepEqual(filterUnwanted([]), []);
    assert.deepEqual(filterUnwanted([1, 2]), [1, 2]);
    assert.deepEqual(filterUnwanted([1, undefined]), [1]);
    assert.deepEqual(filterUnwanted([1, new Set()]), [1]);
    assert.deepEqual(filterUnwanted({ k: [] }), { k: [] });
    assert.deepEqual(filterUnwanted({ k: [1, 2] }), { k: [1, 2] });
    assert.deepEqual(filterUnwanted({ k: [1, undefined] }), { k: [1] });
    assert.deepEqual(filterUnwanted([1, {}]), [1, {}]);
    assert.deepEqual(filterUnwanted([1, { k: 42 }]), [1, { k: 42 }]);
    assert.deepEqual(filterUnwanted([1, { k: 42, j: undefined }]), [1, { k: 42 }]);

    const err = filterUnwanted({ cause: new Error('Msg') });
    assert.deepEqual(err.cause.name, 'Error');
    assert.deepEqual(err.cause.message, 'Msg');
    assert.deepEqual(typeof err.cause.stack, 'string');
});
