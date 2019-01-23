import test from 'ava';
import { filterUnwanted } from '../src/prepare';

test('filterUnwanted', t => {
    t.is(filterUnwanted(undefined), undefined);
    t.is(filterUnwanted(null), undefined);
    t.is(filterUnwanted(''), '');
    t.is(filterUnwanted(false), false);
    t.is(filterUnwanted(42), 42);
    t.deepEqual(filterUnwanted({}), {});
    t.deepEqual(filterUnwanted({ k: 42, j: 43 }), { k: 42, j: 43 });
    t.deepEqual(filterUnwanted({ k: undefined }), {});
    t.deepEqual(filterUnwanted({ k: new Buffer('') }), {});
    t.deepEqual(filterUnwanted([]), []);
    t.deepEqual(filterUnwanted([1, 2]), [1, 2]);
    t.deepEqual(filterUnwanted([1, undefined]), [1]);
    t.deepEqual(filterUnwanted([1, new Set()]), [1]);
    t.deepEqual(filterUnwanted({ k: [] }), { k: [] });
    t.deepEqual(filterUnwanted({ k: [1, 2] }), { k: [1, 2] });
    t.deepEqual(filterUnwanted({ k: [1, undefined] }), { k: [1] });
    t.deepEqual(filterUnwanted([1, {}]), [1, {}]);
    t.deepEqual(filterUnwanted([1, { k: 42 }]), [1, { k: 42 }]);
    t.deepEqual(filterUnwanted([1, { k: 42, j: undefined }]), [1, { k: 42 }]);
});
