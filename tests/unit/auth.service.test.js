jest.mock('../../src/config/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    }
  }
}));

jest.mock('../../src/utils/password', () => ({
  hashPassword: jest.fn(),
  comparePassword: jest.fn()
}));

jest.mock('../../src/utils/token', () => ({
  signAccessToken: jest.fn()
}));

const { prisma } = require('../../src/config/database');
const { hashPassword, comparePassword } = require('../../src/utils/password');
const { signAccessToken } = require('../../src/utils/token');
const authService = require('../../src/services/auth.service');
const AppError = require('../../src/utils/AppError');

describe('auth.service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('registerUser creates a user and returns a token', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    hashPassword.mockResolvedValue('hashed-password');
    prisma.user.create.mockResolvedValue({
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'hashed-password'
    });
    signAccessToken.mockReturnValue('signed-token');

    const result = await authService.registerUser({
      name: 'Ada Lovelace',
      email: 'Ada@example.com',
      password: 'password123'
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'ada@example.com' } });
    expect(hashPassword).toHaveBeenCalledWith('password123');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        name: 'Ada Lovelace',
        email: 'ada@example.com',
        password: 'hashed-password'
      }
    });
    expect(signAccessToken).toHaveBeenCalledWith({ sub: 'user-1', email: 'ada@example.com' });
    expect(result).toEqual({
      user: {
        id: 'user-1',
        name: 'Ada Lovelace',
        email: 'ada@example.com'
      },
      token: 'signed-token'
    });
  });

  test('loginUser rejects invalid credentials', async () => {
    prisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'hashed-password'
    });
    comparePassword.mockResolvedValue(false);

    await expect(
      authService.loginUser({
        email: 'ada@example.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError);

    expect(comparePassword).toHaveBeenCalledWith('wrong-password', 'hashed-password');
  });
});
