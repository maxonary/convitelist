import { expect, test } from 'vitest'
import { xuidToUuid } from '../../src/utils/xuidToUuid';

test('returns a valid uuid', async () => {
    const uuid = await xuidToUuid('000901FD52D76B41');
    expect(uuid).toBe('00000000-0000-0000-0009-01FD52D76B41');
});

test('returns an error if xuid is too short', async () => {
    const uuid = await xuidToUuid('000901FD52D76B4');
    expect(uuid).toBe(false);
});

test('returns an error if xuid is too long', async () => {
    const uuid = await xuidToUuid('000901FD52D76B411');
    expect(uuid).toBe(false);
});

test('returns an error if xuid is does not start with 0009', async () => {
    const uuid = await xuidToUuid('000101FD52D76B41');
    expect(uuid).toBe(false);
});