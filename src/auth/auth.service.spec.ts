import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

const user: User = {
  id: 1,
  username: 'admin',
  password: '1234',
};

const resolvedJwt = {
  access_token: 'jwtToken',
};

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockResolvedValue(user),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('jwtToken'),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
  });

  describe('validateUser', () => {
    // Arrange
    const validatedUser = {
      id: 1,
      username: 'admin',
    };

    it('should return validated user', async () => {
      expect(await authService.validateUser('admin', '1234')).toEqual(
        validatedUser,
      );
    });

    it('should return null if user not found', async () => {
      const invalidUser = {
        username: 'admin',
        password: 'invalidPassword',
      };
      expect(
        await authService.validateUser(
          invalidUser.username,
          invalidUser.password,
        ),
      ).toBeNull();
    });

    it('should return a JWT', async () => {
      expect(await authService.login(user)).toEqual(resolvedJwt);
    });
  });
});
