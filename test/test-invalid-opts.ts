import { test } from 'loltest';
import { createLogger, Options } from '../src/index';
import assert from 'assert';

test('create with missing logHost', () => {
    assert.throws(
        () =>
            createLogger({
                // .. uh oh
            } as Options),
        'create with missing logHost'
    );
});
