import test from 'ava';
import { createLogger, Options } from '../src/index';

test('create with missing logHost', t => {
    t.throws(() => createLogger({
        // .. uh oh
    } as Options), 'Invalid options: logHost is a required field');
});
