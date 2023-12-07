import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Request, Response } from 'express';
import {
  createAdminUser,
  getAllAdminUsers,
  getAdminUserById,
  deleteAdminUserById,
  updateAdminUserById
} from '../../src/controllers/adminController';
import prismaMock from '../../src/lib/__mocks__/prisma';

// Mock the PrismaClient and bcrypt
vi.mock('lib/prisma');
vi.mock('bcrypt', () => ({
  hash: vi.fn(() => 'hashed_password')
}));

describe('Admin Controller', () => {
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
