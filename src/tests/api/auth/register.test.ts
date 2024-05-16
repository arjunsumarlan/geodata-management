import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/auth/register';
import { User } from '@prisma/client';
import prisma from '@/utils/prisma';
import { jest } from '@jest/globals';

jest.mock('@/utils/prisma', () => ({
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
  },
}));
jest.mock('@/utils/auth');

function createNextRequestMock() {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
    method: 'POST',
  });

  // Adding the 'env' property to match NextApiRequest
  Object.defineProperty(req, 'env', {
    value: process.env
  });

  return { req, res };
}

describe('Register API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks in between tests
  });

  it('responds 201 when successful', async () => {
    const { req, res } = createNextRequestMock();
    req.body = { 
      name: 'User Test', 
      email: 'user.test@gmail.com', 
      password: 'test123', 
      role: 'user' 
    };

    const mockUser: User = {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword',
      role: 'user',
      geojson: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockReturnValue(null);

    (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser as never);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(201);
  });

  it('responds 400 when user already exists', async () => {
    const { req, res } = createNextRequestMock();
    req.body = { 
      name: 'User Test', 
      email: 'user.test@gmail.com', 
      password: 'test123', 
      role: 'user' 
    };

    const mockUser: User = {
      id: 1,
      name: 'User Test',
      email: 'user.test@example.com',
      password: 'test123',
      role: 'user',
      geojson: '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.user.findUnique as jest.Mock).mockReturnValue(mockUser);

    (prisma.user.create as jest.Mock).mockResolvedValueOnce(mockUser as never);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('responds 405 if method was not POST', async () => {
    const { req, res } = createNextRequestMock();
    req.method = 'GET';

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('responds 400 if payload was not correct', async () => {
    const { req, res } = createNextRequestMock();
    req.body = { 
      name: '', 
      email: 'user.test@gmail', 
      password: 'test', 
      role: 'user' 
    };

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it('responds 500 if there is a server error', async () => {
    const { req, res } = createNextRequestMock();
    req.body = { name: 'User Test', email: 'user.test@gmail.com', password: 'test123', role: 'user' };

    (prisma.user.findUnique as jest.Mock).mockRejectedValueOnce(new Error('Database error') as never);
    (prisma.user.create as jest.Mock).mockRejectedValueOnce(new Error('Database error') as never);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});
