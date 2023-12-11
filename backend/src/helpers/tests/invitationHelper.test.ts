// import generateInvitationCode from '../invitationHelper';
// import { describe, beforeEach, it, expect, vi } from 'vitest';
// import prismaMock from '../../lib/__mocks__/prisma';
// import crypto from 'crypto';

// vi.mock('lib/prisma')
// vi.mock('crypto', () => ({
//     default: vi.fn(() => ({
//         randomBytes: vi.fn(() => 'mocked-code')
//     }))
// })),


// describe('invitationHelper', () => {
//     beforeEach(() => {
//         vi.restoreAllMocks()
//     });
//     describe('generateInvitationCode', () => {
//         it('should generate a unique invitation code and store it in the database', async () => {
//             const code = await generateInvitationCode()

//             expect(code).toBe('mocked-code');
//             expect(prismaMock.invitationCode.create).toHaveBeenCalledWith({
//             data: {
//                 code: 'mocked-code',
//                 used: false,
//             },
//             })
//             expect(prismaMock.$disconnect).toHaveBeenCalled()
//             expect(crypto.randomBytes).toHaveBeenCalledWith(16)
//             expect(crypto).toHaveBeenCalledTimes(1)
//         })
//     })
// })
