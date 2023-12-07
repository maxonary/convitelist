import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Request, Response } from 'express';
import {
  createAdminUser
} from '../adminController';
import prismaMock from '../../lib/__mocks__/prisma';

// Mock the PrismaClient and bcrypt
vi.mock('lib/prisma');
vi.mock('bcrypt', () => ({
  hash: vi.fn(() => 'hashed_password')
}));

describe('Admin Controller', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let mockRequest, mockResponse;
    beforeEach(() => {
        vi.restoreAllMocks();
        mockRequest = {} as Request;
        mockResponse = {
          json: vi.fn(),
          status: vi.fn(() => mockResponse)
        } as unknown as Response;
    })

    describe('createAdminUser', () => {
        it('should create an admin user successfully', async () => {
            const mockRequest = {
                body: {
                    username: 'testuser',
                    password: 'password',
                    email: 'test@mail.com',
                    invitationCode: '123456'
                }
            } as Request

            await createAdminUser(mockRequest, mockResponse);

            expect(prismaMock.invitationCode.findUnique).toHaveBeenCalledWith({
                where: { code: '123456' },
            });
            expect(prismaMock.invitationCode.update).toHaveBeenCalledWith({
                where: { code: '123456' },
                data: { used: true },
            });
            expect(prismaMock.admin.create).toHaveBeenCalledWith({
                data: {
                    username: 'testuser',
                    password: 'hashed_password',
                    email: 'test@mail.com',
                },
            });
            expect(mockResponse.status).toHaveBeenCalledWith(201);

        })
    })
})
