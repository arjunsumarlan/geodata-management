import jwt from 'jsonwebtoken';
import { authenticate } from '@/utils/auth';

jest.mock('jsonwebtoken');

describe('authenticate', () => {
  const mockConsoleError = jest.spyOn(console, 'error').mockImplementation();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns decoded token when the token is valid', () => {
    const mockDecoded = { userId: '123', email: 'test@gmail.com', role: 'user' };
    (jwt.verify as jest.MockedFunction<typeof jwt.verify>).mockReturnValue(mockDecoded as any);

    process.env.JWT_SECRET = 'test-secret';

    const req = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const result = authenticate(req);
    expect(result).toEqual(mockDecoded);
    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET);
  });

  it('returns null and logs error when the token is invalid', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    const req = {
      headers: {
        authorization: 'Bearer invalid-token',
      },
    };

    const result = authenticate(req);
    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('returns null and logs error when the token is missing', () => {
    const req = {
      headers: {
        authorization: 'Bearer ',
      },
    };

    const result = authenticate(req);
    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();
  });

  it('returns null and logs error when the secret is missing', () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, JWT_SECRET: '' };

    const req = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const result = authenticate(req);
    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();

    process.env = originalEnv; // Restore original environment variables
  });

  it('returns null and logs error when authorization header is missing', () => {
    const req = {
      headers: {
        authorization: ''
      },
    };

    const result = authenticate(req);
    expect(result).toBeNull();
    expect(mockConsoleError).toHaveBeenCalled();
  });
});
