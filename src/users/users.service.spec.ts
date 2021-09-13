import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

const user: User = {
  id: 1,
  username: 'admin',
  password: '1234',
};

const updatedUser: User = {
  id: 1,
  username: 'admin',
  password: '111',
};

describe('UsersService', () => {
  let userService: UsersService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn().mockResolvedValue([user]),
            save: jest.fn().mockResolvedValue(user),
            findOne: jest.fn().mockResolvedValue(user),
            findOneOrFail: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(updatedUser),
            delete: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    userService = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
    expect(userRepository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      // Act
      const users = await userService.findAll();

      // Assert
      expect(users).toEqual([user]);
    });
    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userRepository, 'find').mockRejectedValue(new Error());

      // Act
      const users = userService.findAll();

      // Assert
      expect(users).rejects.toThrowError();
    });
  });
  describe('findOne', () => {
    it('should return a user', async () => {
      // Act
      const body = await userService.findOne('1');

      // Assert
      expect(body).toEqual(user);
    });
    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userRepository, 'findOne').mockRejectedValue(new Error());

      // Act
      const user = userService.findOne('1');

      // Assert
      expect(user).rejects.toThrowError();
    });
  });

  describe('create', () => {
    it('should return a user', async () => {
      // Arrange
      const userDto: CreateUserDto = {
        username: 'admin',
        password: '1234',
      };

      // Act
      const body = await userService.create(userDto);

      // Assert
      expect(body).toEqual(user);
    });
    it('should throw an exception', () => {
      // Arrange
      const userDto: CreateUserDto = {
        username: 'admin',
        password: '1234',
      };
      jest.spyOn(userRepository, 'save').mockRejectedValue(new Error());

      // Act
      const body = userService.create(userDto);

      // Assert
      expect(body).rejects.toThrowError();
    });
  });

  describe('update', () => {
    it('should return a user', async () => {
      // Arrange
      const userDto: UpdateUserDto = {
        username: 'admin',
        password: '111',
      };
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(updatedUser);

      // Act
      const body = await userService.update(1, userDto);

      // Assert
      expect(body).toEqual(updatedUser);
    });
    it('should throw an exception', () => {
      // Arrange
      const userDto: UpdateUserDto = {
        username: 'admin',
        password: '111',
      };
      jest.spyOn(userRepository, 'update').mockRejectedValue(new Error());

      // Act
      const body = userService.update(1, userDto);

      // Assert
      expect(body).rejects.toThrowError();
    });
  });

  describe('delete', () => {
    it('should return undefined', async () => {
      // Arrange
      // jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValueOnce(user);

      // Act
      const body = await userService.remove(1);

      // Assert
      expect(body).toBeUndefined;
    });
    it('should throw an exception', () => {
      // Arrange
      jest.spyOn(userRepository, 'delete').mockRejectedValue(new Error());

      // Act
      const body = userService.remove(1);

      // Assert
      expect(body).rejects.toThrowError();
    });
  });
});
