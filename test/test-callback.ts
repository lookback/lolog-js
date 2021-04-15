import { test } from 'loltest';
import { createMockLogger } from './_mock_logger';
import assert from 'assert';

test('log callback', async () => {
    const { log } = await createMockLogger();

    const waitPromise = wait(1000);

    const logPromise = new Promise<void>((rs) => {
        log.info(
            'hi',
            <any>{
                callback: () => rs(),
            },
            { random: 42 },
        );
    });

    await Promise.race([waitPromise, logPromise]);

    assert.ok('callback was called');
});

/** Creates a Promise which will reject after `ms` milliseconds. */
const wait = (ms: number) =>
    new Promise<string>((_, rj) => setTimeout(() => rj(`Timed out after ${ms}ms`), ms));

test('trace promise return', async () => {
    const { log } = await createMockLogger();

    const waitPromise = wait(1000);

    const logPromise = log.track('hej');

    await Promise.race([waitPromise, logPromise]);

    assert.ok('promise did resolve');
});
