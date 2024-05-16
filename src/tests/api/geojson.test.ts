import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';
import handler from '@/pages/api/geojson';
import { authenticate } from '@/utils/auth';
import { geojsonSchema } from '@/utils/schemas';
import { hint } from '@mapbox/geojsonhint';
import prisma from '@/utils/prisma';
import { jest } from '@jest/globals';
import { z } from 'zod';
import { parseErrors } from '@/utils';

jest.mock('@mapbox/geojsonhint', () => ({
  hint: jest.fn(),
}));
jest.mock('@/utils/auth', () => ({
  authenticate: jest.fn(),
}));
jest.mock('@/utils/prisma', () => ({
  user: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));
jest.mock('@/utils/schemas', () => ({
  geojsonSchema: {
    parse: jest.fn(),
  },
}));
jest.mock('@/utils', () => ({
  parseErrors: jest.fn(),
}));

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

describe('GeoJSON API', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks in between tests
  });

  it("responds 405 if method was not POST", async () => {
    const { req, res } = createNextRequestMock();
    req.method = "GET";

    await handler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });

  it('responds 401 if no authorization header is present', async () => {
    const { req, res } = createNextRequestMock();
    req.body = JSON.stringify({ 
      name: 'User Test', 
      email: 'user.test@gmail.com', 
      password: 'testpassword', 
      role: 'user' 
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: 'Unauthorized - No Authorization Header'
    });
  });


  it('responds 401 if token is invalid', async () => {
    (authenticate as jest.Mock).mockReturnValue(null);

    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer fake-token';
    req.body = JSON.stringify({ 
      name: 'User Test', 
      email: 'user.test@gmail.com', 
      password: 'testpassword', 
      role: 'user' 
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({
      message: 'Unauthorized - Invalid Token'
    });
  });

  it('responds 400 for invalid GeoJSON input', async () => {
    (authenticate as jest.Mock).mockReturnValue({ email: 'user@gmail.com', userId: '1', role: 'user' });

    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer valid-token';
    req.body.geojson = 'invalid-geojson';
    req.body.email = 'user@gmail.com';
    
    (geojsonSchema.parse as jest.Mock).mockReturnValue(req.body);
    (hint as jest.Mock).mockReturnValue([{
      message: 'Parse error on line 1:\n' +
      'invalid-geojson\n' +
      '^\n' +
      "Expecting 'STRING', 'NUMBER', 'NULL', 'TRUE', 'FALSE', '{', '[', got 'INVALID'"
    }]);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({
      message: 'Parse error on line 1:\n' +
        'invalid-geojson\n' +
        '^\n' +
        "Expecting 'STRING', 'NUMBER', 'NULL', 'TRUE', 'FALSE', '{', '[', got 'INVALID'; "
    });
  });
  
  it('returns 401 when user is not authorized to change other user geo data', async () => {
    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer valid-token';
    req.body = {
      email: 'other.user@gmail.com',
      geojson: {},
    };

    (authenticate as jest.Mock).mockReturnValue({ email: 'user@gmail.com', role: 'user' });
    (geojsonSchema.parse as jest.Mock).mockReturnValue(req.body);
    (hint as jest.Mock).mockReturnValue([]);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(401);
    expect(res._getJSONData()).toEqual({ message: "Unauthorized - Only admin can change other user geo data." });
  });

  it('returns 400 when user email is not found', async () => {
    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer valid-token';
    req.body = {
      email: 'notfound@gmail.com',
      geojson: {},
    };

    (authenticate as jest.Mock).mockReturnValue({ email: 'admin@gmail.com', role: 'admin' });
    (geojsonSchema.parse as jest.Mock).mockReturnValue(req.body);
    (hint as jest.Mock).mockReturnValue([]);
    (prisma.user.findUnique as jest.Mock).mockReturnValueOnce(null);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: "Bad Request - User email not found." });
  });

  it('returns 200 when GeoJSON is processed successfully', async () => {
    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer valid-token';
    req.body = {
      email: 'user@gmail.com',
      geojson: {},
    };

    const mockUser = {
      id: 1,
      email: 'user@gmail.com',
      geojson: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    (authenticate as jest.Mock).mockReturnValue({ email: 'admin@gmail.com', role: 'admin' });
    (geojsonSchema.parse as jest.Mock).mockReturnValue(req.body);
    (hint as jest.Mock).mockReturnValue([]);
    (prisma.user.findUnique as jest.Mock).mockReturnValueOnce(mockUser);
    (prisma.user.update as jest.Mock).mockReturnValueOnce({
      ...mockUser,
      geojson: req.body.geojson,
    } as never);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(res._getJSONData()).toEqual({
      message: "GeoJSON processed successfully",
      data: { ...mockUser, geojson: req.body.geojson },
    });
  });

  it('returns 400 when geojsonSchema validation fails', async () => {
    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer valid-token';
    req.body = {
      email: 'user@gmail.com',
      geojson: {},
    };

    const mockError = new z.ZodError([]);

    (geojsonSchema.parse as jest.Mock).mockImplementation(() => {
      throw mockError;
    });

    (parseErrors as jest.Mock).mockReturnValue('Invalid payload');

    await handler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(res._getJSONData()).toEqual({ message: 'Invalid payload' });
  });

  it('returns 500 when there is a server error', async () => {
    const { req, res } = createNextRequestMock();
    req.headers.authorization = 'Bearer valid-token';
    req.body = {
      email: 'user@gmail.com',
      geojson: {},
    };

    (geojsonSchema.parse as jest.Mock).mockReturnValue(req.body);
    (authenticate as jest.Mock).mockReturnValue({ email: 'user@gmail.com', role: 'user' });
    (hint as jest.Mock).mockReturnValue([]);
    (prisma.user.findUnique as jest.Mock).mockRejectedValue(new Error('Database error') as never);

    await handler(req, res);

    expect(res._getStatusCode()).toBe(500);
    expect(res._getJSONData()).toEqual({ message: 'Internal server error' });
  });
});
